"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LZOCompression = void 0;
// LZO
// import {loadLibrary} from '@loaders.gl/worker-utils';
const loader_utils_1 = require("@loaders.gl/loader-utils");
const compression_1 = require("./compression");
// import {isBrowser} from '@loaders.gl/loader-utils';
// import lzo from 'lzo'; // https://bundlephobia.com/package/lzo
// import {decompress} from 'lzo-wasm';
// const LZO_WASM_JS_URL = './node_modules/lzo-wasm/lzo-wasm.js';
// const LZO_WASM_WASM_URL = './node_modules/lzo-wasm/lzo-wasm.wasm';
let lzo;
/**
 * Lempel-Ziv-Oberheimer compression / decompression
 */
class LZOCompression extends compression_1.Compression {
    /**
     * lzo is an injectable dependency due to big size
     * @param options
     */
    constructor(options) {
        super(options);
        this.name = 'lzo';
        this.extensions = [];
        this.contentEncodings = [];
        this.isSupported = false; // !isBrowser;
        this.options = options;
        lzo = lzo || this.options?.modules?.lzo;
        if (!lzo) {
            throw new Error(this.name);
        }
    }
    async preload() {
        // await loadLibrary(LZO_WASM_JS_URL);
        // await loadLibrary(LZO_WASM_WASM_URL);
    }
    async compress(input) {
        await this.preload();
        // const inputArray = new Uint8Array(input);
        const inputBuffer = (0, loader_utils_1.toBuffer)(input);
        return lzo.compress(inputBuffer).buffer;
    }
    async decompress(input) {
        try {
            await this.preload();
            // const inputArray = new Uint8Array(input);
            const inputBuffer = (0, loader_utils_1.toBuffer)(input);
            return lzo.decompress(inputBuffer).buffer;
        }
        catch (error) {
            // TODO - solve SharedArrayBuffer issues
            // return decompress(input);
            throw error;
        }
    }
}
exports.LZOCompression = LZOCompression;
