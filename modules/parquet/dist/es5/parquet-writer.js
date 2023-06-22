"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetWriter = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_PARQUET_LOADER_OPTIONS = {};
var ParquetWriter = {
  name: 'Apache Parquet',
  id: 'parquet',
  module: 'parquet',
  version: VERSION,
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  encodeSync: encodeSync,
  binary: true,
  options: DEFAULT_PARQUET_LOADER_OPTIONS
};
exports.ParquetWriter = ParquetWriter;
function encodeSync(data, options) {
  return new ArrayBuffer(0);
}
//# sourceMappingURL=parquet-writer.js.map