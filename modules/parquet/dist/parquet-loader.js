"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParqueColumnnartLoader = exports.ParquetLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_PARQUET_LOADER_OPTIONS = {
    parquet: {
        type: 'object-row-table',
        url: undefined,
        columnList: [],
        geoparquet: true
    }
};
/** ParquetJS table loader */
exports.ParquetLoader = {
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
exports.ParqueColumnnartLoader = {
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
