"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_utils_1 = require("@loaders.gl/worker-utils");
// Compressors
const no_compression_1 = require("../lib/no-compression");
const brotli_compression_1 = require("../lib/brotli-compression");
const deflate_compression_1 = require("../lib/deflate-compression");
const gzip_compression_1 = require("../lib/gzip-compression");
const lz4_compression_1 = require("../lib/lz4-compression");
// import {LZOCompression} from '../lib/lzo-compression.js';
const snappy_compression_1 = require("../lib/snappy-compression");
const zstd_compression_1 = require("../lib/zstd-compression");
// Import big dependencies
// import brotli from 'brotli'; - brotli has problems with decompress in browsers
// import brotliDecompress from 'brotli/decompress';
const lz4js_1 = __importDefault(require("lz4js"));
// import lzo from 'lzo';
// import {ZstdCodec} from 'zstd-codec';
// Inject large dependencies through Compression constructor options
const modules = {
    // brotli has problems with decompress in browsers
    // brotli: {
    //   decompress: brotliDecompress,
    //   compress: () => {
    //     throw new Error('brotli compress');
    //   }
    // },
    lz4js: lz4js_1.default
    // lzo,
    // 'zstd-codec': ZstdCodec
};
/** @type {Compression[]} */
const COMPRESSIONS = [
    new no_compression_1.NoCompression({ modules }),
    new brotli_compression_1.BrotliCompression({ modules }),
    new deflate_compression_1.DeflateCompression({ modules }),
    new gzip_compression_1.GZipCompression({ modules }),
    // new LZOCompression({modules}),
    new lz4_compression_1.LZ4Compression({ modules }),
    new snappy_compression_1.SnappyCompression({ modules }),
    new zstd_compression_1.ZstdCompression({ modules })
];
(0, worker_utils_1.createWorker)(async (data, options = {}) => {
    const operation = getOperation(String(options?.operation));
    const compression = getCompression(String(options?.compression));
    // @ts-ignore
    switch (operation) {
        case 'compress':
            return await compression.compress(data);
        case 'decompress':
            return await compression.decompress(data);
        default:
            throw new Error('invalid option');
    }
});
function getOperation(operation) {
    switch (operation) {
        case 'compress':
        case 'deflate':
            return 'compress';
        case 'decompress':
        case 'inflate':
            return 'decompress';
        default:
            throw new Error(`@loaders.gl/compression: Unsupported operation ${operation}. Expected 'compress' or 'decompress'`);
    }
}
function getCompression(name) {
    const Compression = COMPRESSIONS.find((compression_) => name === compression_.name);
    if (!Compression) {
        throw new Error(`@loaders.gl/compression: Unsupported compression ${name}`);
    }
    return Compression;
}
