"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckParquetLoader = exports.ParquetWasmLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_PARQUET_LOADER_OPTIONS = {
  parquet: {
    type: 'arrow-table',
    wasmUrl: 'https://unpkg.com/parquet-wasm@0.3.1/esm2/arrow1_bg.wasm'
  }
};
var ParquetWasmLoader = {
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
exports.ParquetWasmLoader = ParquetWasmLoader;
var _typecheckParquetLoader = ParquetWasmLoader;
exports._typecheckParquetLoader = _typecheckParquetLoader;
//# sourceMappingURL=parquet-wasm-loader.js.map