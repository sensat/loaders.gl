"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckArrowLoader = exports.ArrowLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var ArrowLoader = {
  name: 'Apache Arrow',
  id: 'arrow',
  module: 'arrow',
  version: VERSION,
  category: 'table',
  extensions: ['arrow', 'feather'],
  mimeTypes: ['application/vnd.apache.arrow.file', 'application/vnd.apache.arrow.stream', 'application/octet-stream'],
  binary: true,
  tests: ['ARROW'],
  options: {
    arrow: {
      shape: 'columnar-table'
    }
  }
};
exports.ArrowLoader = ArrowLoader;
var _typecheckArrowLoader = ArrowLoader;
exports._typecheckArrowLoader = _typecheckArrowLoader;
//# sourceMappingURL=arrow-loader.js.map