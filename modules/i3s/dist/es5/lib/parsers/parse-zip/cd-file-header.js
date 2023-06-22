"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseZipCDFileHeader = void 0;
var parseZipCDFileHeader = function parseZipCDFileHeader(headerOffset, buffer) {
  var offsets = {
    CD_COMPRESSED_SIZE_OFFSET: 20,
    CD_UNCOMPRESSED_SIZE_OFFSET: 24,
    CD_FILE_NAME_LENGTH_OFFSET: 28,
    CD_EXTRA_FIELD_LENGTH_OFFSET: 30,
    CD_LOCAL_HEADER_OFFSET_OFFSET: 42,
    CD_FILE_NAME_OFFSET: 46
  };
  var compressedSize = buffer.getUint32(headerOffset + offsets.CD_COMPRESSED_SIZE_OFFSET, true);
  var uncompressedSize = buffer.getUint32(headerOffset + offsets.CD_UNCOMPRESSED_SIZE_OFFSET, true);
  var fileNameLength = buffer.getUint16(headerOffset + offsets.CD_FILE_NAME_LENGTH_OFFSET, true);
  var fileName = buffer.buffer.slice(headerOffset + offsets.CD_FILE_NAME_OFFSET, headerOffset + offsets.CD_FILE_NAME_OFFSET + fileNameLength);
  var extraOffset = headerOffset + offsets.CD_FILE_NAME_OFFSET + fileNameLength;
  var oldFormatOffset = buffer.getUint32(headerOffset + offsets.CD_LOCAL_HEADER_OFFSET_OFFSET, true);
  var fileDataOffset = oldFormatOffset;
  if (fileDataOffset === 0xffffffff) {
    var offsetInZip64Data = 4;
    if (compressedSize === 0xffffffff) {
      offsetInZip64Data += 8;
    }
    if (uncompressedSize === 0xffffffff) {
      offsetInZip64Data += 8;
    }
    fileDataOffset = buffer.getUint32(extraOffset + offsetInZip64Data, true);
  }
  var localHeaderOffset = fileDataOffset;
  return {
    compressedSize: compressedSize,
    uncompressedSize: uncompressedSize,
    fileNameLength: fileNameLength,
    fileName: fileName,
    extraOffset: extraOffset,
    localHeaderOffset: localHeaderOffset
  };
};
exports.parseZipCDFileHeader = parseZipCDFileHeader;
//# sourceMappingURL=cd-file-header.js.map