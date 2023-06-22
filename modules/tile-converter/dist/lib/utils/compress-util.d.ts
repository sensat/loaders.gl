/**
 * Compress file to gzip file
 *
 * @param pathFile - the path to the file
 * @return the path to the gzip file
 */
export declare function compressFileWithGzip(pathFile: string): Promise<string>;
/**
 * Compress files from map into slpk file
 *
 * @param fileMap - map with file paths (key: output path, value: input path)
 * @param outputFile - output slpk file
 * @param level - compression level
 */
export declare function compressFilesWithZip(fileMap: {
    [key: string]: string;
}, outputFile: string, level?: number): Promise<unknown>;
/**
 * Compress files using external tool 'zip'/'7z'
 *
 * @param inputFolder - folder to archive - for cwd option
 * @param outputFile - output slpk file
 * @param level - compression level
 * @param inputFiles - input files path to pass to the executable as option
 * @param sevenZipExe - path to 7z.exe executable
 */
export declare function compressWithChildProcess(inputFolder: string, outputFile: string, level: number, inputFiles: string, sevenZipExe: string): Promise<void>;
/**
 * Generate hash file from zip archive
 * https://github.com/Esri/i3s-spec/blob/master/docs/1.7/slpk_hashtable.cmn.md
 *
 * @param inputZipFile
 * @param outputFile
 */
export declare function generateHash128FromZip(inputZipFile: string, outputFile: string): Promise<unknown>;
/**
 * Add file to zip archive
 *
 * @param inputFile
 * @param fileName
 * @param zipFile
 * @param sevenZipExe
 */
export declare function addFileToZip(inputFolder: string, fileName: string, zipFile: string, sevenZipExe: string): Promise<void>;
//# sourceMappingURL=compress-util.d.ts.map