import { isBrowser } from '@loaders.gl/core';
import { BROWSER_ERROR_MESSAGE } from '../constants';
import { FileHandleProvider } from './helpers/file-handle-provider';
import { parseZipLocalFileHeader } from '@loaders.gl/i3s';
import { path } from '@loaders.gl/loader-utils';
import { GZipCompression } from '@loaders.gl/compression';
import { writeFile } from '../lib/utils/file-utils';
const indexNames = ['3dSceneLayer.json.gz', '3dNodeIndexDocument.json.gz', 'sharedResource.json.gz'];
export default class SLPKExtractor {
  async extract(options) {
    if (isBrowser) {
      console.log(BROWSER_ERROR_MESSAGE);
      return BROWSER_ERROR_MESSAGE;
    }
    const {
      inputUrl
    } = options;
    const provider = await FileHandleProvider.from(inputUrl);
    let localHeader = await parseZipLocalFileHeader(0, provider);
    while (localHeader) {
      var _localHeader, _localHeader2;
      await this.writeFile(await this.unGzip({
        name: this.correctIndexNames(localHeader.fileName),
        data: await provider.slice(localHeader.fileDataOffset, localHeader.fileDataOffset + localHeader.compressedSize)
      }), options.outputPath);
      localHeader = await parseZipLocalFileHeader(((_localHeader = localHeader) === null || _localHeader === void 0 ? void 0 : _localHeader.fileDataOffset) + ((_localHeader2 = localHeader) === null || _localHeader2 === void 0 ? void 0 : _localHeader2.compressedSize), provider);
    }
    return 'success';
  }
  correctIndexNames(fileName) {
    if (indexNames.includes(path.filename(path.join('/', fileName)))) {
      return path.join(path.dirname(fileName), 'index.json.gz');
    }
    let parts = /^(.*\/[^\/\.]*)(\..+)$/.exec(fileName);
    if (!parts) {
      return null;
    }
    return "".concat(parts === null || parts === void 0 ? void 0 : parts.at(1), "/index").concat(parts === null || parts === void 0 ? void 0 : parts.at(2));
  }
  async unGzip(file) {
    var _file$name;
    if (/\.gz$/.test((_file$name = file.name) !== null && _file$name !== void 0 ? _file$name : '')) {
      var _file$name2;
      const compression = new GZipCompression();
      const decompressedData = await compression.decompress(file.data);
      return {
        data: decompressedData,
        name: ((_file$name2 = file.name) !== null && _file$name2 !== void 0 ? _file$name2 : '').slice(0, -3)
      };
    }
    return Promise.resolve(file);
  }
  async writeFile(options, outputPath) {
    if (!options.name) {
      return;
    }
    const finalPath = path.join(outputPath, options.name);
    const dirName = path.dirname(finalPath);
    const fileName = path.filename(finalPath);
    await writeFile(dirName, options.data, fileName);
  }
}
//# sourceMappingURL=slpk-extractor.js.map