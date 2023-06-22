"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnappyCompression = void 0;
const compression_1 = require("./compression");
const snappyjs_1 = require("snappyjs"); // https://bundlephobia.com/package/snappy
/**
 * Snappy/zippy compression / decompression
 */
class SnappyCompression extends compression_1.Compression {
    constructor(options) {
        super(options);
        this.name = 'snappy';
        this.extensions = [];
        this.contentEncodings = [];
        this.isSupported = true;
        this.options = options || {};
    }
    compressSync(input) {
        // Accepts arrayBuffer - https://github.com/zhipeng-jia/snappyjs#usage
        return (0, snappyjs_1.compress)(input);
    }
    decompressSync(input) {
        // Accepts arrayBuffer - https://github.com/zhipeng-jia/snappyjs#usage
        return (0, snappyjs_1.uncompress)(input);
    }
}
exports.SnappyCompression = SnappyCompression;
