"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCompression = void 0;
const compression_1 = require("./compression");
/**
 * Applies no compression.
 */
class NoCompression extends compression_1.Compression {
    constructor(options) {
        super(options);
        this.name = 'uncompressed';
        this.extensions = [];
        this.contentEncodings = [];
        this.isSupported = true;
        this.options = options || {};
    }
    compressSync(input) {
        return input;
    }
    decompressSync(input) {
        return input;
    }
    async *compressBatches(asyncIterator) {
        return yield* asyncIterator;
    }
    async *decompressBatches(asyncIterator) {
        return yield* asyncIterator;
    }
}
exports.NoCompression = NoCompression;
