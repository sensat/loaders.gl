"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetLoader = exports.ParqueColumnnartLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_PARQUET_LOADER_OPTIONS = {
  parquet: {
    type: 'object-row-table',
    url: undefined,
    columnList: [],
    geoparquet: true
  }
};
var ParquetLoader = {
  name: 'Apache Parquet',
  id: 'parquet',
  module: 'parquet',
  version: VERSION,
  worker: true,
  category: 'table',
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  binary: true,
  tests: ['PAR1', 'PARE'],
  options: DEFAULT_PARQUET_LOADER_OPTIONS
};
exports.ParquetLoader = ParquetLoader;
var ParqueColumnnartLoader = {
  name: 'Apache Parquet',
  id: 'parquet',
  module: 'parquet',
  version: VERSION,
  worker: true,
  category: 'table',
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  binary: true,
  tests: ['PAR1', 'PARE'],
  options: DEFAULT_PARQUET_LOADER_OPTIONS
};
exports.ParqueColumnnartLoader = ParqueColumnnartLoader;
//# sourceMappingURL=parquet-loader.js.map