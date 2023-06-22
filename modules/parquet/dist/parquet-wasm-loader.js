"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckParquetLoader = exports.ParquetWasmLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_PARQUET_LOADER_OPTIONS = {
    parquet: {
        type: 'arrow-table',
        wasmUrl: 'https://unpkg.com/parquet-wasm@0.3.1/esm2/arrow1_bg.wasm'
    }
};
/** ParquetJS table loader */
exports.ParquetWasmLoader = {
    name: 'Apache Parquet',
    id: 'parquet-wasm',
    module: 'parquet',
    version: VERSION,
    worker: false,
    category: 'table',
    extensions: ['parquet'],
    mimeTypes: ['application/octet-stream'],
    binary: true,
    tests: ['PAR1', 'PARE'],
    options: DEFAULT_PARQUET_LOADER_OPTIONS
};
exports._typecheckParquetLoader = exports.ParquetWasmLoader;
