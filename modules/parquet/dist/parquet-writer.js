"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetWriter = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_PARQUET_LOADER_OPTIONS = {};
exports.ParquetWriter = {
    name: 'Apache Parquet',
    id: 'parquet',
    module: 'parquet',
    version: VERSION,
    extensions: ['parquet'],
    mimeTypes: ['application/octet-stream'],
    encodeSync,
    binary: true,
    options: DEFAULT_PARQUET_LOADER_OPTIONS
};
function encodeSync(data, options) {
    return new ArrayBuffer(0);
}
