"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetWasmWriter = void 0;
const encode_parquet_wasm_1 = require("./lib/wasm/encode-parquet-wasm");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_PARQUET_WRITER_OPTIONS = {
    parquet: {
        wasmUrl: 'https://unpkg.com/parquet-wasm@0.3.1/esm2/arrow1_bg.wasm'
    }
};
exports.ParquetWasmWriter = {
    name: 'Apache Parquet',
    id: 'parquet-wasm',
    module: 'parquet',
    version: VERSION,
    extensions: ['parquet'],
    mimeTypes: ['application/octet-stream'],
    encode: encode_parquet_wasm_1.encode,
    binary: true,
    options: DEFAULT_PARQUET_WRITER_OPTIONS
};
