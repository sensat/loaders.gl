"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFilesSize = exports.timeConverter = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const file_utils_1 = require("./file-utils");
function timeConverter(time) {
    const nanoSecondsInMillisecond = 1e6;
    let timeInSeconds = time[0];
    const hours = Math.floor(timeInSeconds / 3600);
    timeInSeconds = timeInSeconds - hours * 3600;
    const minutes = Math.floor(timeInSeconds / 60);
    timeInSeconds = timeInSeconds - minutes * 60;
    const seconds = Math.floor(timeInSeconds);
    const milliseconds = time[1] / nanoSecondsInMillisecond;
    let result = '';
    if (hours) {
        result += `${hours}h `;
    }
    if (minutes) {
        result += `${minutes}m `;
    }
    if (seconds) {
        result += `${seconds}s`;
    }
    if (!result) {
        result += `${milliseconds}ms`;
    }
    return result;
}
exports.timeConverter = timeConverter;
async function calculateFilesSize(params) {
    const { slpk, outputPath, tilesetName } = params;
    const fullOutputPath = (0, file_utils_1.getAbsoluteFilePath)(outputPath);
    try {
        if (slpk) {
            const slpkPath = (0, path_1.join)(fullOutputPath, `${tilesetName}.slpk`);
            const stat = await fs_1.promises.stat(slpkPath);
            return stat.size;
        }
        const directoryPath = (0, path_1.join)(fullOutputPath, tilesetName);
        const totalSize = await getTotalFilesSize(directoryPath);
        return totalSize;
    }
    catch (error) {
        console.log('Calculate file sizes error: ', error); // eslint-disable-line
        return null;
    }
}
exports.calculateFilesSize = calculateFilesSize;
async function getTotalFilesSize(dirPath) {
    let totalFileSize = 0;
    const files = await fs_1.promises.readdir(dirPath);
    for (const file of files) {
        const fileStat = await fs_1.promises.stat((0, path_1.join)(dirPath, file));
        if (fileStat.isDirectory()) {
            totalFileSize += await getTotalFilesSize((0, path_1.join)(dirPath, file));
        }
        else {
            totalFileSize += fileStat.size;
        }
    }
    return totalFileSize;
}
