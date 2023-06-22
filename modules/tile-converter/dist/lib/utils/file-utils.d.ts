/**
 * Write a file with data and name fileName to path
 *
 * @param path - output path
 * @param data - file content
 * @param fileName - name of output file (default: index.json)
 */
export declare function writeFile(path: string, data: string | Uint8Array | ArrayBuffer | Promise<ArrayBuffer>, fileName?: string): Promise<string>;
/**
 * Write a file with data and name fileName to path - specific one for further packaging into slpk
 *
 * @param path - output path
 * @param data - file content
 * @param fileName - name of output file (default: index.json)
 * @param compress - if need to compress file with gzip (default: true)
 * @param compressList - if set - the file should be added to this list and compressed in the end of conversion
 */
export declare function writeFileForSlpk(path: string, data: string | Uint8Array | ArrayBuffer | Promise<ArrayBuffer>, fileName?: string, compress?: boolean, compressList?: string[] | null): Promise<string | null>;
/**
 * Open json file
 * @param path - path to the file
 * @param fileName - file name
 * @returns object
 */
export declare function openJson(path: string, fileName: string): Promise<{
    [key: string]: any;
}>;
/**
 * Check if the file exists
 * @param fileName - full name of file
 * @returns true if file exists, otherwise - false
 */
export declare function isFileExists(fileName: string): Promise<boolean>;
/**
 * Remove dir with path
 *
 * @param path
 */
export declare function removeDir(path: string): Promise<void>;
/**
 * Remove file with path
 *
 * @param path
 */
export declare function removeFile(path: string): Promise<void>;
/**
 * Generates absolute file path
 * @param filePath
 */
export declare function getAbsoluteFilePath(filePath: string): string;
//# sourceMappingURL=file-utils.d.ts.map