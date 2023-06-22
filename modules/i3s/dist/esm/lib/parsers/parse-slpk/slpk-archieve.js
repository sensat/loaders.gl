import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { processOnWorker } from '@loaders.gl/worker-utils';
import md5 from 'md5';
import { CompressionWorker } from '@loaders.gl/compression';
import { parseZipLocalFileHeader } from '../parse-zip/local-file-header';
const PATH_DESCRIPTIONS = [{
  test: /^$/,
  extensions: ['3dSceneLayer.json.gz']
}, {
  test: /^nodepages\/\d+$/,
  extensions: ['.json.gz']
}, {
  test: /^nodes\/\d+$/,
  extensions: ['/3dNodeIndexDocument.json.gz']
}, {
  test: /^nodes\/\d+\/textures\/.+$/,
  extensions: ['.jpg', '.png', '.bin.dds.gz', '.ktx']
}, {
  test: /^nodes\/\d+\/geometries\/\d+$/,
  extensions: ['.bin.gz', '.draco.gz']
}, {
  test: /^nodes\/\d+\/attributes\/f_\d+\/\d+$/,
  extensions: ['.bin.gz']
}, {
  test: /^statistics\/f_\d+\/\d+$/,
  extensions: ['.json.gz']
}, {
  test: /^nodes\/\d+\/shared$/,
  extensions: ['/sharedResource.json.gz']
}];
export class SLPKArchive {
  constructor(slpkArchiveBuffer, hashFile) {
    _defineProperty(this, "slpkArchive", void 0);
    _defineProperty(this, "hashArray", void 0);
    this.slpkArchive = new DataView(slpkArchiveBuffer);
    this.hashArray = this.parseHashFile(hashFile);
  }
  parseHashFile(hashFile) {
    const hashFileBuffer = Buffer.from(hashFile);
    const hashArray = [];
    for (let i = 0; i < hashFileBuffer.buffer.byteLength; i = i + 24) {
      const offsetBuffer = new DataView(hashFileBuffer.buffer.slice(hashFileBuffer.byteOffset + i + 16, hashFileBuffer.byteOffset + i + 24));
      const offset = offsetBuffer.getUint32(offsetBuffer.byteOffset, true);
      hashArray.push({
        hash: Buffer.from(hashFileBuffer.subarray(hashFileBuffer.byteOffset + i, hashFileBuffer.byteOffset + i + 16)),
        offset
      });
    }
    return hashArray;
  }
  async getFile(path) {
    let mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'raw';
    if (mode === 'http') {
      var _PATH_DESCRIPTIONS$fi;
      const extensions = (_PATH_DESCRIPTIONS$fi = PATH_DESCRIPTIONS.find(val => val.test.test(path))) === null || _PATH_DESCRIPTIONS$fi === void 0 ? void 0 : _PATH_DESCRIPTIONS$fi.extensions;
      if (extensions) {
        let data;
        for (const ext of extensions) {
          data = await this.getDataByPath("".concat(path).concat(ext));
          if (data) {
            break;
          }
        }
        if (data) {
          return Buffer.from(data);
        }
      }
    }
    if (mode === 'raw') {
      const decompressedFile = await this.getDataByPath("".concat(path, ".gz"));
      if (decompressedFile) {
        return Buffer.from(decompressedFile);
      }
      const fileWithoutCompression = this.getFileBytes(path);
      if (fileWithoutCompression) {
        return Buffer.from(fileWithoutCompression);
      }
    }
    throw new Error('No such file in the archieve');
  }
  async getDataByPath(path) {
    const data = this.getFileBytes(path);
    if (!data) {
      return undefined;
    }
    if (/\.gz$/.test(path)) {
      const decompressedData = await processOnWorker(CompressionWorker, data, {
        compression: 'gzip',
        operation: 'decompress',
        _workerType: 'test',
        gzip: {}
      });
      return decompressedData;
    }
    return Buffer.from(data);
  }
  getFileBytes(path) {
    const nameHash = Buffer.from(md5(path), 'hex');
    const fileInfo = this.hashArray.find(val => Buffer.compare(val.hash, nameHash) === 0);
    if (!fileInfo) {
      return undefined;
    }
    const localFileHeader = parseZipLocalFileHeader(this.slpkArchive.byteOffset + (fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.offset), this.slpkArchive);
    const compressedFile = this.slpkArchive.buffer.slice(localFileHeader.fileDataOffset, localFileHeader.fileDataOffset + localFileHeader.compressedSize);
    return compressedFile;
  }
}
//# sourceMappingURL=slpk-archieve.js.map