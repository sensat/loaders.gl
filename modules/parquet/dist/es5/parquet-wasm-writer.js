"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetWasmWriter = void 0;
var _encodeParquetWasm = require("./lib/wasm/encode-parquet-wasm");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_PARQUET_WRITER_OPTIONS = {
  parquet: {
    wasmUrl: 'https://unpkg.com/parquet-wasm@0.3.1/esm2/arrow1_bg.wasm'
  }
};
var ParquetWasmWriter = {
  name: 'Apache Parquet',
  id: 'parquet-wasm',
  module: 'parquet',
  version: VERSION,
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  encode: _encodeParquetWasm.encode,
  binary: true,
  options: DEFAULT_PARQUET_WRITER_OPTIONS
};
exports.ParquetWasmWriter = ParquetWasmWriter;
//# sourceMappingURL=parquet-wasm-writer.js.map