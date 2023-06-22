"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GZipCompression = void 0;
const deflate_compression_1 = require("./deflate-compression");
/**
 * GZIP compression / decompression
 */
class GZipCompression extends deflate_compression_1.DeflateCompression {
    constructor(options) {
        super({ ...options, deflate: { ...options?.gzip, gzip: true } });
        this.name = 'gzip';
        this.extensions = ['gz', 'gzip'];
        this.contentEncodings = ['gzip', 'x-gzip'];
        this.isSupported = true;
    }
}
exports.GZipCompression = GZipCompression;
