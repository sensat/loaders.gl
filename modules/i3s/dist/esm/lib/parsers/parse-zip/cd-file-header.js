export const parseZipCDFileHeader = (headerOffset, buffer) => {
  const offsets = {
    CD_COMPRESSED_SIZE_OFFSET: 20,
    CD_UNCOMPRESSED_SIZE_OFFSET: 24,
    CD_FILE_NAME_LENGTH_OFFSET: 28,
    CD_EXTRA_FIELD_LENGTH_OFFSET: 30,
    CD_LOCAL_HEADER_OFFSET_OFFSET: 42,
    CD_FILE_NAME_OFFSET: 46
  };
  const compressedSize = buffer.getUint32(headerOffset + offsets.CD_COMPRESSED_SIZE_OFFSET, true);
  const uncompressedSize = buffer.getUint32(headerOffset + offsets.CD_UNCOMPRESSED_SIZE_OFFSET, true);
  const fileNameLength = buffer.getUint16(headerOffset + offsets.CD_FILE_NAME_LENGTH_OFFSET, true);
  const fileName = buffer.buffer.slice(headerOffset + offsets.CD_FILE_NAME_OFFSET, headerOffset + offsets.CD_FILE_NAME_OFFSET + fileNameLength);
  const extraOffset = headerOffset + offsets.CD_FILE_NAME_OFFSET + fileNameLength;
  const oldFormatOffset = buffer.getUint32(headerOffset + offsets.CD_LOCAL_HEADER_OFFSET_OFFSET, true);
  let fileDataOffset = oldFormatOffset;
  if (fileDataOffset === 0xffffffff) {
    let offsetInZip64Data = 4;
    if (compressedSize === 0xffffffff) {
      offsetInZip64Data += 8;
    }
    if (uncompressedSize === 0xffffffff) {
      offsetInZip64Data += 8;
    }
    fileDataOffset = buffer.getUint32(extraOffset + offsetInZip64Data, true);
  }
  const localHeaderOffset = fileDataOffset;
  return {
    compressedSize,
    uncompressedSize,
    fileNameLength,
    fileName,
    extraOffset,
    localHeaderOffset
  };
};
//# sourceMappingURL=cd-file-header.js.map