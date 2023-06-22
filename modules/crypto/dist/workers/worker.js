"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRC32CHash = exports.CRC32Hash = void 0;
const worker_utils_1 = require("@loaders.gl/worker-utils");
const crc32_hash_1 = require("../lib/crc32-hash");
Object.defineProperty(exports, "CRC32Hash", { enumerable: true, get: function () { return crc32_hash_1.CRC32Hash; } });
const crc32c_hash_1 = require("../lib/crc32c-hash");
Object.defineProperty(exports, "CRC32CHash", { enumerable: true, get: function () { return crc32c_hash_1.CRC32CHash; } });
const md5_hash_1 = require("../lib/md5-hash");
(0, worker_utils_1.createWorker)(async (data, options = {}) => {
    // @ts-ignore
    const { operation } = options;
    switch (operation) {
        case 'crc32':
            return await new crc32_hash_1.CRC32Hash(options).hash(data);
        case 'crc32c':
            return await new crc32c_hash_1.CRC32CHash(options).hash(data);
        case 'md5':
            return await new md5_hash_1.MD5Hash(options).hash(data);
        default:
            throw new Error(`invalid option: ${operation}`);
    }
});
