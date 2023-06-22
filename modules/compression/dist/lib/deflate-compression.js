"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeflateCompression = void 0;
const compression_1 = require("./compression");
const loader_utils_1 = require("@loaders.gl/loader-utils");
const pako_1 = __importDefault(require("pako")); // https://bundlephobia.com/package/pako
const zlib_1 = __importDefault(require("zlib"));
const loader_utils_2 = require("@loaders.gl/loader-utils");
/**
 * DEFLATE compression / decompression
 */
class DeflateCompression extends compression_1.Compression {
    constructor(options = {}) {
        super(options);
        this.name = 'deflate';
        this.extensions = [];
        this.contentEncodings = ['deflate'];
        this.isSupported = true;
        this._chunks = [];
        this.options = options;
    }
    async compress(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.deflate?.useZlib) {
            const buffer = this.options.deflate?.gzip
                ? await (0, loader_utils_2.promisify1)(zlib_1.default.gzip)(input)
                : await (0, loader_utils_2.promisify1)(zlib_1.default.deflate)(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        return this.compressSync(input);
    }
    async decompress(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.deflate?.useZlib) {
            const buffer = this.options.deflate?.gzip
                ? await (0, loader_utils_2.promisify1)(zlib_1.default.gunzip)(input)
                : await (0, loader_utils_2.promisify1)(zlib_1.default.inflate)(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        return this.decompressSync(input);
    }
    compressSync(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.deflate?.useZlib) {
            const buffer = this.options.deflate?.gzip ? zlib_1.default.gzipSync(input) : zlib_1.default.deflateSync(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        const pakoOptions = this.options?.deflate || {};
        const inputArray = new Uint8Array(input);
        return pako_1.default.deflate(inputArray, pakoOptions).buffer;
    }
    decompressSync(input) {
        // On Node.js we can use built-in zlib
        if (!loader_utils_1.isBrowser && this.options.deflate?.useZlib) {
            const buffer = this.options.deflate?.gzip ? zlib_1.default.gunzipSync(input) : zlib_1.default.inflateSync(input);
            return (0, loader_utils_1.toArrayBuffer)(buffer);
        }
        const pakoOptions = this.options?.deflate || {};
        const inputArray = new Uint8Array(input);
        return pako_1.default.inflate(inputArray, pakoOptions).buffer;
    }
    async *compressBatches(asyncIterator) {
        const pakoOptions = this.options?.deflate || {};
        const pakoProcessor = new pako_1.default.Deflate(pakoOptions);
        yield* this.transformBatches(pakoProcessor, asyncIterator);
    }
    async *decompressBatches(asyncIterator) {
        const pakoOptions = this.options?.deflate || {};
        const pakoProcessor = new pako_1.default.Inflate(pakoOptions);
        yield* this.transformBatches(pakoProcessor, asyncIterator);
    }
    async *transformBatches(pakoProcessor, asyncIterator) {
        pakoProcessor.onData = this._onData.bind(this);
        pakoProcessor.onEnd = this._onEnd.bind(this);
        for await (const chunk of asyncIterator) {
            const uint8Array = new Uint8Array(chunk);
            const ok = pakoProcessor.push(uint8Array, false); // false -> not last chunk
            if (!ok) {
                throw new Error(`${this._getError()}write`);
            }
            const chunks = this._getChunks();
            yield* chunks;
        }
        // End
        const emptyChunk = new Uint8Array(0);
        const ok = pakoProcessor.push(emptyChunk, true); // true -> last chunk
        if (!ok) {
            // For some reason we get error but it still works???
            // throw new Error(this._getError() + 'end');
        }
        const chunks = this._getChunks();
        yield* chunks;
    }
    _onData(chunk) {
        this._chunks.push(chunk);
    }
    _onEnd(status) {
        if (status !== 0) {
            throw new Error(this._getError(status) + this._chunks.length);
        }
    }
    _getChunks() {
        const chunks = this._chunks;
        this._chunks = [];
        return chunks;
    }
    // TODO - For some reason we don't get the error message from pako in _onEnd?
    _getError(code = 0) {
        const MESSAGES = {
            /* Z_NEED_DICT       2  */
            2: 'need dictionary',
            /* Z_STREAM_END      1  */
            1: 'stream end',
            /* Z_OK              0  */
            0: '',
            /* Z_ERRNO         (-1) */
            '-1': 'file error',
            /* Z_STREAM_ERROR  (-2) */
            '-2': 'stream error',
            /* Z_DATA_ERROR    (-3) */
            '-3': 'data error',
            /* Z_MEM_ERROR     (-4) */
            '-4': 'insufficient memory',
            /* Z_BUF_ERROR     (-5) */
            '-5': 'buffer error',
            /* Z_VERSION_ERROR (-6) */
            '-6': 'incompatible version'
        };
        return `${this.name}: ${MESSAGES[code]}`;
    }
}
exports.DeflateCompression = DeflateCompression;
