"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseZipLocalFileHeader = void 0;
var parseZipLocalFileHeader = function parseZipLocalFileHeader(headerOffset, buffer) {
  var offsets = {
    COMPRESSED_SIZE_OFFSET: 18,
    FILE_NAME_LENGTH_OFFSET: 26,
    EXTRA_FIELD_LENGTH_OFFSET: 28,
    FILE_NAME_OFFSET: 30
  };
  var fileNameLength = buffer.getUint16(headerOffset + offsets.FILE_NAME_LENGTH_OFFSET, true);
  var extraFieldLength = buffer.getUint16(headerOffset + offsets.EXTRA_FIELD_LENGTH_OFFSET, true);
  var fileDataOffset = headerOffset + offsets.FILE_NAME_OFFSET + fileNameLength + extraFieldLength;
  var compressedSize = buffer.getUint32(headerOffset + offsets.COMPRESSED_SIZE_OFFSET, true);
  return {
    fileNameLength: fileNameLength,
    extraFieldLength: extraFieldLength,
    fileDataOffset: fileDataOffset,
    compressedSize: compressedSize
  };
};
exports.parseZipLocalFileHeader = parseZipLocalFileHeader;
//# sourceMappingURL=local-file-header.js.map