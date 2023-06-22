"use strict";
// import type {WorkerObject} from '@loaders.gl/worker-utils';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoJSWorker = exports.CryptoWorker = exports._toHex = exports._hexToBase64 = exports.NodeHash = exports.CryptoHash = exports.SHA256Hash = exports.MD5Hash = exports.CRC32CHash = exports.CRC32Hash = void 0;
var crc32_hash_1 = require("./lib/crc32-hash");
Object.defineProperty(exports, "CRC32Hash", { enumerable: true, get: function () { return crc32_hash_1.CRC32Hash; } });
var crc32c_hash_1 = require("./lib/crc32c-hash");
Object.defineProperty(exports, "CRC32CHash", { enumerable: true, get: function () { return crc32c_hash_1.CRC32CHash; } });
var md5_hash_1 = require("./lib/md5-hash");
Object.defineProperty(exports, "MD5Hash", { enumerable: true, get: function () { return md5_hash_1.MD5Hash; } });
var sha256_hash_1 = require("./lib/sha256-hash");
Object.defineProperty(exports, "SHA256Hash", { enumerable: true, get: function () { return sha256_hash_1.SHA256Hash; } });
var crypto_hash_1 = require("./lib/crypto-hash");
Object.defineProperty(exports, "CryptoHash", { enumerable: true, get: function () { return crypto_hash_1.CryptoHash; } });
var node_hash_1 = require("./lib/node-hash");
Object.defineProperty(exports, "NodeHash", { enumerable: true, get: function () { return node_hash_1.NodeHash; } });
var digest_utils_1 = require("./lib/utils/digest-utils");
Object.defineProperty(exports, "_hexToBase64", { enumerable: true, get: function () { return digest_utils_1.hexToBase64; } });
Object.defineProperty(exports, "_toHex", { enumerable: true, get: function () { return digest_utils_1.toHex; } });
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Small, fast worker for CRC32, CRC32c and MD5 Hashes
 */
exports.CryptoWorker = {
    id: 'crypto',
    name: 'CRC32, CRC32c and MD5 Hashes',
    module: 'crypto',
    version: VERSION,
    options: {
        crypto: {}
    }
};
/**
 * Large worker for full complement of Cryptographic Hashes
 * bundles the full crypto.js library
 */
exports.CryptoJSWorker = {
    id: 'cryptojs',
    name: 'Cryptographic Hashes',
    module: 'crypto',
    version: VERSION,
    options: {
        cryptojs: {}
    }
};
