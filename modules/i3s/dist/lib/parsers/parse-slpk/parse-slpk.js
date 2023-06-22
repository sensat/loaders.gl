"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSLPK = void 0;
const cd_file_header_1 = require("../parse-zip/cd-file-header");
const local_file_header_1 = require("../parse-zip/local-file-header");
const slpk_archieve_1 = require("./slpk-archieve");
/**
 * Returns one byte from the provided buffer at the provided position
 * @param offset - position where to read
 * @param buffer - buffer to read
 * @returns one byte from the provided buffer at the provided position
 */
const getByteAt = (offset, buffer) => {
    return buffer.getUint8(buffer.byteOffset + offset);
};
async function parseSLPK(data, options = {}) {
    const archive = new DataView(data);
    const cdFileHeaderSignature = [80, 75, 1, 2];
    const searchWindow = [
        getByteAt(archive.byteLength - 1, archive),
        getByteAt(archive.byteLength - 2, archive),
        getByteAt(archive.byteLength - 3, archive),
        undefined
    ];
    let hashCDOffset = 0;
    // looking for the last record in the central directory
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
    const cdFileHeader = (0, cd_file_header_1.parseZipCDFileHeader)(hashCDOffset, archive);
    const textDecoder = new TextDecoder();
    if (textDecoder.decode(cdFileHeader.fileName) !== '@specialIndexFileHASH128@') {
        throw new Error('No hash file in slpk');
    }
    const localFileHeader = (0, local_file_header_1.parseZipLocalFileHeader)(cdFileHeader.localHeaderOffset, archive);
    const fileDataOffset = localFileHeader.fileDataOffset;
    const hashFile = archive.buffer.slice(fileDataOffset, fileDataOffset + localFileHeader.compressedSize);
    if (!hashFile) {
        throw new Error('No hash file in slpk');
    }
    return await new slpk_archieve_1.SLPKArchive(data, hashFile).getFile(options.slpk?.path ?? '', options.slpk?.pathMode);
}
exports.parseSLPK = parseSLPK;
