/**
 * zip local file header info
 * according to https://en.wikipedia.org/wiki/ZIP_(file_format)
 */
export type ZipLocalFileHeader = {
    /**
     * File name length
     */
    fileNameLength: number;
    /**
     * Extra field length
     */
    extraFieldLength: number;
    /**
     * Offset of the file data
     */
    fileDataOffset: number;
    /**
     * Compressed size
     */
    compressedSize: number;
};
/**
 * Parses local file header of zip file
 * @param headerOffset - offset in the archive where header starts
 * @param buffer - buffer containing whole array
 * @returns Info from the header
 */
export declare const parseZipLocalFileHeader: (headerOffset: number, buffer: DataView) => ZipLocalFileHeader;
//# sourceMappingURL=local-file-header.d.ts.map