"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckPLYLoader = exports.PLYLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var PLYLoader = {
  name: 'PLY',
  id: 'ply',
  module: 'ply',
  version: VERSION,
  worker: true,
  extensions: ['ply'],
  mimeTypes: ['text/plain', 'application/octet-stream'],
  text: true,
  binary: true,
  tests: ['ply'],
  options: {
    ply: {}
  }
};
exports.PLYLoader = PLYLoader;
var _typecheckPLYLoader = PLYLoader;
exports._typecheckPLYLoader = _typecheckPLYLoader;
//# sourceMappingURL=ply-loader.js.map