"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LASLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_LAS_OPTIONS = {
  las: {
    shape: 'mesh',
    fp64: false,
    skip: 1,
    colorDepth: 8
  }
};
var LASLoader = {
  name: 'LAS',
  id: 'las',
  module: 'las',
  version: VERSION,
  worker: true,
  extensions: ['las', 'laz'],
  mimeTypes: ['application/octet-stream'],
  text: true,
  binary: true,
  tests: ['LAS'],
  options: DEFAULT_LAS_OPTIONS
};
exports.LASLoader = LASLoader;
//# sourceMappingURL=las-loader.js.map