"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckCompressionWorker = exports.CompressionWorker = void 0;
exports.compressOnWorker = compressOnWorker;
var _workerUtils = require("@loaders.gl/worker-utils");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var CompressionWorker = {
  id: 'compression',
  name: 'compression',
  module: 'compression',
  version: VERSION,
  options: {}
};
exports.CompressionWorker = CompressionWorker;
function compressOnWorker(data, options) {
  return (0, _workerUtils.processOnWorker)(CompressionWorker, data, options);
}
var _typecheckCompressionWorker = CompressionWorker;
exports._typecheckCompressionWorker = _typecheckCompressionWorker;
//# sourceMappingURL=compression-worker.js.map