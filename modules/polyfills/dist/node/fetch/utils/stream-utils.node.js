"use strict";
// loaders.gl, MIT license
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatenateArrayBuffers = exports.concatenateReadStream = exports.decompressReadStream = void 0;
const zlib_1 = __importDefault(require("zlib"));
const decode_data_uri_node_1 = require("./decode-data-uri.node");
/**
 *
 */
function decompressReadStream(readStream, headers) {
    switch (headers.get('content-encoding')) {
        case 'br':
            return readStream.pipe(zlib_1.default.createBrotliDecompress());
        case 'gzip':
            return readStream.pipe(zlib_1.default.createGunzip());
        case 'deflate':
            return readStream.pipe(zlib_1.default.createDeflate());
        default:
            // No compression or an unknown one, just return it as is
            return readStream;
    }
}
exports.decompressReadStream = decompressReadStream;
/**
 *
 * @param readStream
 * @returns
 */
async function concatenateReadStream(readStream) {
    const arrayBufferChunks = [];
    return await new Promise((resolve, reject) => {
        readStream.on('error', (error) => reject(error));
        // Once the readable callback has been added, stream switches to "flowing mode"
        // In Node 10 (but not 12 and 14) this causes `data` and `end` to never be called unless we read data here
        readStream.on('readable', () => readStream.read());
        readStream.on('data', (chunk) => {
            if (typeof chunk === 'string') {
                reject(new Error('Read stream not binary'));
            }
            arrayBufferChunks.push((0, decode_data_uri_node_1.toArrayBuffer)(chunk));
        });
        readStream.on('end', () => {
            const arrayBuffer = concatenateArrayBuffers(arrayBufferChunks);
            resolve(arrayBuffer);
        });
    });
}
exports.concatenateReadStream = concatenateReadStream;
/**
 * Concatenate a sequence of ArrayBuffers
 * @return A concatenated ArrayBuffer
 * @note duplicates loader-utils since polyfills should be independent
 */
function concatenateArrayBuffers(sources) {
    // Make sure all inputs are wrapped in typed arrays
    const sourceArrays = sources.map((source2) => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
    // Get length of all inputs
    const byteLength = sourceArrays.reduce((length, typedArray) => length + typedArray.byteLength, 0);
    // Allocate array with space for all inputs
    const result = new Uint8Array(byteLength);
    // Copy the subarrays
    let offset = 0;
    for (const sourceArray of sourceArrays) {
        result.set(sourceArray, offset);
        offset += sourceArray.byteLength;
    }
    // We work with ArrayBuffers, discard the typed array wrapper
    return result.buffer;
}
exports.concatenateArrayBuffers = concatenateArrayBuffers;
