/**
 * zip central directory file header info
 * according to https://en.wikipedia.org/wiki/ZIP_(file_format)
 */
export type ZipCDFileHeader = {
    /**
     * Compressed size
     */
    compressedSize: number;
    /**
     * Uncompressed size
     */
    uncompressedSize: number;
    /**
     * File name length
     */
    fileNameLength: number;
    /**
     * File name
     */
    fileName: ArrayBuffer;
    /**
     * Extra field offset
     */
    extraOffset: number;
    /**
     * Relative offset of local file header
     */
    localHeaderOffset: number;
};
/**
 * Parses central directory file header of zip file
 * @param headerOffset - offset in the archive where header starts
 * @param buffer - buffer containing whole array
 * @returns Info from the header
 */
export declare const parseZipCDFileHeader: (headerOffset: number, buffer: DataView) => ZipCDFileHeader;
//# sourceMappingURL=cd-file-header.d.ts.map