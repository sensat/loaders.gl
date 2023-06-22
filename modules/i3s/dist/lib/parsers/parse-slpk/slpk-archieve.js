"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLPKArchive = void 0;
const worker_utils_1 = require("@loaders.gl/worker-utils");
const md5_1 = __importDefault(require("md5"));
const compression_1 = require("@loaders.gl/compression");
const local_file_header_1 = require("../parse-zip/local-file-header");
const PATH_DESCRIPTIONS = [
    {
        test: /^$/,
        extensions: ['3dSceneLayer.json.gz']
    },
    {
        test: /^nodepages\/\d+$/,
        extensions: ['.json.gz']
    },
    {
        test: /^nodes\/\d+$/,
        extensions: ['/3dNodeIndexDocument.json.gz']
    },
    {
        test: /^nodes\/\d+\/textures\/.+$/,
        extensions: ['.jpg', '.png', '.bin.dds.gz', '.ktx']
    },
    {
        test: /^nodes\/\d+\/geometries\/\d+$/,
        extensions: ['.bin.gz', '.draco.gz']
    },
    {
        test: /^nodes\/\d+\/attributes\/f_\d+\/\d+$/,
        extensions: ['.bin.gz']
    },
    {
        test: /^statistics\/f_\d+\/\d+$/,
        extensions: ['.json.gz']
    },
    {
        test: /^nodes\/\d+\/shared$/,
        extensions: ['/sharedResource.json.gz']
    }
];
/**
 * Class for handling information about slpk file
 */
class SLPKArchive {
    constructor(slpkArchiveBuffer, hashFile) {
        this.slpkArchive = new DataView(slpkArchiveBuffer);
        this.hashArray = this.parseHashFile(hashFile);
    }
    /**
     * Reads hash file from buffer and returns it in ready-to-use form
     * @param hashFile - bufer containing hash file
     * @returns Array containing file info
     */
    parseHashFile(hashFile) {
        const hashFileBuffer = Buffer.from(hashFile);
        const hashArray = [];
        for (let i = 0; i < hashFileBuffer.buffer.byteLength; i = i + 24) {
            const offsetBuffer = new DataView(hashFileBuffer.buffer.slice(hashFileBuffer.byteOffset + i + 16, hashFileBuffer.byteOffset + i + 24));
            const offset = offsetBuffer.getUint32(offsetBuffer.byteOffset, true);
            hashArray.push({
                hash: Buffer.from(hashFileBuffer.subarray(hashFileBuffer.byteOffset + i, hashFileBuffer.byteOffset + i + 16)),
                offset
            });
        }
        return hashArray;
    }
    /**
     * Returns file with the given path from slpk archive
     * @param path - path inside the slpk
     * @param mode - currently only raw mode supported
     * @returns buffer with ready to use file
     */
    async getFile(path, mode = 'raw') {
        if (mode === 'http') {
            const extensions = PATH_DESCRIPTIONS.find((val) => val.test.test(path))?.extensions;
            if (extensions) {
                let data;
                for (const ext of extensions) {
                    data = await this.getDataByPath(`${path}${ext}`);
                    if (data) {
                        break;
                    }
                }
                if (data) {
                    return Buffer.from(data);
                }
            }
        }
        if (mode === 'raw') {
            const decompressedFile = await this.getDataByPath(`${path}.gz`);
            if (decompressedFile) {
                return Buffer.from(decompressedFile);
            }
            const fileWithoutCompression = this.getFileBytes(path);
            if (fileWithoutCompression) {
                return Buffer.from(fileWithoutCompression);
            }
        }
        throw new Error('No such file in the archieve');
    }
    /**
     * returning uncompressed data for paths that ends with .gz and raw data for all other paths
     * @param path - path inside the archive
     * @returns buffer with the file data
     */
    async getDataByPath(path) {
        const data = this.getFileBytes(path);
        if (!data) {
            return undefined;
        }
        if (/\.gz$/.test(path)) {
            const decompressedData = await (0, worker_utils_1.processOnWorker)(compression_1.CompressionWorker, data, {
                compression: 'gzip',
                operation: 'decompress',
                _workerType: 'test',
                gzip: {}
            });
            return decompressedData;
        }
        return Buffer.from(data);
    }
    /**
     * Trying to get raw file data by adress
     * @param path - path inside the archive
     * @returns buffer with the raw file data
     */
    getFileBytes(path) {
        const nameHash = Buffer.from((0, md5_1.default)(path), 'hex');
        const fileInfo = this.hashArray.find((val) => Buffer.compare(val.hash, nameHash) === 0);
        if (!fileInfo) {
            return undefined;
        }
        const localFileHeader = (0, local_file_header_1.parseZipLocalFileHeader)(this.slpkArchive.byteOffset + fileInfo?.offset, this.slpkArchive);
        const compressedFile = this.slpkArchive.buffer.slice(localFileHeader.fileDataOffset, localFileHeader.fileDataOffset + localFileHeader.compressedSize);
        return compressedFile;
    }
}
exports.SLPKArchive = SLPKArchive;
