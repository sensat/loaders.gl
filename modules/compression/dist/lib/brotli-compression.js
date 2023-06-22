"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrotliCompression = void 0;
const compression_1 = require("./compression");
const loader_utils_1 = require("@loaders.gl/loader-utils");
// import brotli from 'brotli';  // https://bundlephobia.com/package/brotli
const decode_1 = require("../brotli/decode");
const zlib_1 = __importDefault(require("zlib"));
const loader_utils_2 = require("@loaders.gl/loader-utils");
const DEFAULT_BROTLI_OPTIONS = {
    brotli: {
        mode: 0,
        quality: 8,
        lgwin: 22
    }
};
let brotli;
/**
 * brotli compression / decompression
 */
class BrotliCompression extends compression_1.Compression {
    constructor(options) {
        super(options);
        this.name = 'brotli';
        this.extensions = ['br'];
        this.contentEncodings = ['br'];
        this.isSupported = true;
        this.options = options;
    }
    /**
     * brotli is an injectable dependency due to big size
     * @param options
     */
    async preload() {
        brotli = brotli || this.options?.modules?.brotli;
        if (!brotli) {
            // eslint-disable-next-line no-console
            console.warn(`${this.name} library not installed`);
        }
    }
    async compress(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.brotli?.useZlib) {
            const buffer = await (0, loader_utils_2.promisify1)(zlib_1.default.brotliCompress)(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        return this.compressSync(input);
    }
    compressSync(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.brotli?.useZlib) {
            const buffer = zlib_1.default.brotliCompressSync(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        const brotliOptions = { ...DEFAULT_BROTLI_OPTIONS.brotli, ...this.options?.brotli };
        const inputArray = new Uint8Array(input);
        if (!brotli) {
            throw new Error('brotli compression: brotli module not installed');
        }
        // @ts-ignore brotli types state that only Buffers are accepted...
        const outputArray = brotli.compress(inputArray, brotliOptions);
        return outputArray.buffer;
    }
    async decompress(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.brotli?.useZlib) {
            const buffer = await (0, loader_utils_2.promisify1)(zlib_1.default.brotliDecompress)(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        return this.decompressSync(input);
    }
    decompressSync(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.brotli?.useZlib) {
            const buffer = zlib_1.default.brotliDecompressSync(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        const brotliOptions = { ...DEFAULT_BROTLI_OPTIONS.brotli, ...this.options?.brotli };
        const inputArray = new Uint8Array(input);
        if (brotli) {
            // @ts-ignore brotli types state that only Buffers are accepted...
            const outputArray = brotli.decompress(inputArray, brotliOptions);
            return outputArray.buffer;
        }
        const outputArray = (0, decode_1.BrotliDecode)(inputArray, undefined);
        return outputArray.buffer;
    }
}
exports.BrotliCompression = BrotliCompression;
