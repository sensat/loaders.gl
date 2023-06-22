/// <reference types="node" />
/**
 * Class for handling information about slpk file
 */
export declare class SLPKArchive {
    slpkArchive: DataView;
    hashArray: {
        hash: Buffer;
        offset: number;
    }[];
    constructor(slpkArchiveBuffer: ArrayBuffer, hashFile: ArrayBuffer);
    /**
     * Reads hash file from buffer and returns it in ready-to-use form
     * @param hashFile - bufer containing hash file
     * @returns Array containing file info
     */
    private parseHashFile;
    /**
     * Returns file with the given path from slpk archive
     * @param path - path inside the slpk
     * @param mode - currently only raw mode supported
     * @returns buffer with ready to use file
     */
    getFile(path: string, mode?: 'http' | 'raw'): Promise<Buffer>;
    /**
     * returning uncompressed data for paths that ends with .gz and raw data for all other paths
     * @param path - path inside the archive
     * @returns buffer with the file data
     */
    private getDataByPath;
    /**
     * Trying to get raw file data by adress
     * @param path - path inside the archive
     * @returns buffer with the raw file data
     */
    private getFileBytes;
}
//# sourceMappingURL=slpk-archieve.d.ts.map