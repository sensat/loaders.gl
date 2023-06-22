"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsoluteFilePath = exports.removeFile = exports.removeDir = exports.isFileExists = exports.openJson = exports.writeFileForSlpk = exports.writeFile = void 0;
const core_1 = require("@loaders.gl/core");
const loader_utils_1 = require("@loaders.gl/loader-utils");
const fs_1 = require("fs");
const path_1 = require("path");
const compress_util_1 = require("./compress-util");
/**
 * Write a file with data and name fileName to path
 *
 * @param path - output path
 * @param data - file content
 * @param fileName - name of output file (default: index.json)
 */
async function writeFile(path, data, fileName = 'index.json') {
    let toWriteData;
    if (data instanceof Promise) {
        toWriteData = new Uint8Array(await data);
    }
    else if (data instanceof ArrayBuffer) {
        toWriteData = new Uint8Array(data);
    }
    else {
        toWriteData = data;
    }
    await fs_1.promises.mkdir(path, { recursive: true });
    const pathFile = (0, path_1.join)(path, fileName);
    try {
        await fs_1.promises.writeFile(pathFile, toWriteData);
    }
    catch (err) {
        throw err;
    }
    console.log(`${pathFile} saved.`); // eslint-disable-line
    return pathFile;
}
exports.writeFile = writeFile;
/**
 * Write a file with data and name fileName to path - specific one for further packaging into slpk
 *
 * @param path - output path
 * @param data - file content
 * @param fileName - name of output file (default: index.json)
 * @param compress - if need to compress file with gzip (default: true)
 * @param compressList - if set - the file should be added to this list and compressed in the end of conversion
 */
async function writeFileForSlpk(path, data, fileName = 'index.json', compress = true, compressList) {
    const pathFile = await writeFile(path, data, fileName);
    if (compress) {
        if (compressList) {
            if (!compressList.includes(pathFile)) {
                compressList.push(pathFile);
                return `${pathFile}.gz`;
            }
            else {
                return null;
            }
        }
        else {
            const pathGzFile = await (0, compress_util_1.compressFileWithGzip)(pathFile);
            // After compression, we don't need an uncompressed file
            await removeFile(pathFile);
            return pathGzFile;
        }
    }
    return pathFile;
}
exports.writeFileForSlpk = writeFileForSlpk;
/**
 * Open json file
 * @param path - path to the file
 * @param fileName - file name
 * @returns object
 */
async function openJson(path, fileName) {
    return new Promise((resolve, reject) => {
        let count = 0;
        console.log(`load ${path}/${fileName}.`); // eslint-disable-line
        const intervalId = setInterval(() => {
            const pathFile = (0, path_1.join)(path, fileName);
            (0, core_1.load)(pathFile, loader_utils_1.JSONLoader)
                .then((result) => {
                clearInterval(intervalId);
                resolve(result);
            })
                .catch(() => {
                count++;
                if (count > 100) {
                    clearInterval(intervalId);
                    reject(new Error(`Cannon load ${path}/${fileName}.`));
                }
            });
        }, 200);
    });
}
exports.openJson = openJson;
/**
 * Check if the file exists
 * @param fileName - full name of file
 * @returns true if file exists, otherwise - false
 */
async function isFileExists(fileName) {
    try {
        await fs_1.promises.stat(fileName);
        return true;
    }
    catch {
        return false;
    }
}
exports.isFileExists = isFileExists;
/**
 * Remove dir with path
 *
 * @param path
 */
function removeDir(path) {
    // (node:35607) [DEP0147] DeprecationWarning: In future versions of Node.js, fs.rmdir(path, { recursive: true }) will be removed. Use fs.rm(path, { recursive: true }) instead
    return fs_1.promises.rm(path, { recursive: true });
}
exports.removeDir = removeDir;
/**
 * Remove file with path
 *
 * @param path
 */
function removeFile(path) {
    return fs_1.promises.unlink(path);
}
exports.removeFile = removeFile;
/**
 * Generates absolute file path
 * @param filePath
 */
function getAbsoluteFilePath(filePath) {
    return (0, path_1.isAbsolute)(filePath) ? filePath : (0, path_1.join)(process.cwd(), filePath);
}
exports.getAbsoluteFilePath = getAbsoluteFilePath;
