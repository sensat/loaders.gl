"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZstdCompression = void 0;
const compression_1 = require("./compression");
// import {ZstdCodec} from 'zstd-codec'; // https://bundlephobia.com/package/zstd-codec
let ZstdCodec;
let zstd;
/**
 * Zstandard compression / decompression
 */
class ZstdCompression extends compression_1.Compression {
    /**
     * zstd-codec is an injectable dependency due to big size
     * @param options
     */
    constructor(options) {
        super(options);
        this.name = 'zstd';
        this.extensions = [];
        this.contentEncodings = [];
        this.isSupported = true;
        this.options = options;
        ZstdCodec = this.options?.modules?.['zstd-codec'];
        if (!ZstdCodec) {
            // eslint-disable-next-line no-console
            console.warn(`${this.name} library not installed`);
        }
    }
    async preload() {
        if (!zstd && ZstdCodec) {
            zstd = await new Promise((resolve) => ZstdCodec.run((zstd) => resolve(zstd)));
        }
    }
    compressSync(input) {
        const simpleZstd = new zstd.Simple();
        const inputArray = new Uint8Array(input);
        return simpleZstd.compress(inputArray).buffer;
    }
    decompressSync(input) {
        const simpleZstd = new zstd.Simple();
        // var ddict = new zstd.Dict.Decompression(dictData);
        // var jsonBytes = simpleZstd.decompressUsingDict(jsonZstData, ddict);
        const inputArray = new Uint8Array(input);
        return simpleZstd.decompress(inputArray).buffer;
    }
}
exports.ZstdCompression = ZstdCompression;
