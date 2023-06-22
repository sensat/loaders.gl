import { parseZipCDFileHeader } from '../parse-zip/cd-file-header';
import { parseZipLocalFileHeader } from '../parse-zip/local-file-header';
import { SLPKArchive } from './slpk-archieve';
const getByteAt = (offset, buffer) => {
  return buffer.getUint8(buffer.byteOffset + offset);
};
export async function parseSLPK(data) {
  var _options$slpk$path, _options$slpk, _options$slpk2;
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const archive = new DataView(data);
  const cdFileHeaderSignature = [80, 75, 1, 2];
  const searchWindow = [getByteAt(archive.byteLength - 1, archive), getByteAt(archive.byteLength - 2, archive), getByteAt(archive.byteLength - 3, archive), undefined];
  let hashCDOffset = 0;
  for (let i = archive.byteLength - 4; i > -1; i--) {
    searchWindow[3] = searchWindow[2];
    searchWindow[2] = searchWindow[1];
    searchWindow[1] = searchWindow[0];
    searchWindow[0] = getByteAt(i, archive);
    if (searchWindow.every((val, index) => val === cdFileHeaderSignature[index])) {
      hashCDOffset = i;
      break;
    }
  }
  const cdFileHeader = parseZipCDFileHeader(hashCDOffset, archive);
  const textDecoder = new TextDecoder();
  if (textDecoder.decode(cdFileHeader.fileName) !== '@specialIndexFileHASH128@') {
    throw new Error('No hash file in slpk');
  }
  const localFileHeader = parseZipLocalFileHeader(cdFileHeader.localHeaderOffset, archive);
  const fileDataOffset = localFileHeader.fileDataOffset;
  const hashFile = archive.buffer.slice(fileDataOffset, fileDataOffset + localFileHeader.compressedSize);
  if (!hashFile) {
    throw new Error('No hash file in slpk');
  }
  return await new SLPKArchive(data, hashFile).getFile((_options$slpk$path = (_options$slpk = options.slpk) === null || _options$slpk === void 0 ? void 0 : _options$slpk.path) !== null && _options$slpk$path !== void 0 ? _options$slpk$path : '', (_options$slpk2 = options.slpk) === null || _options$slpk2 === void 0 ? void 0 : _options$slpk2.pathMode);
}
//# sourceMappingURL=parse-slpk.js.map