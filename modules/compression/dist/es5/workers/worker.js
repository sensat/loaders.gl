"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _workerUtils = require("@loaders.gl/worker-utils");
var _noCompression = require("../lib/no-compression");
var _brotliCompression = require("../lib/brotli-compression");
var _deflateCompression = require("../lib/deflate-compression");
var _gzipCompression = require("../lib/gzip-compression");
var _lz4Compression = require("../lib/lz4-compression");
var _snappyCompression = require("../lib/snappy-compression");
var _zstdCompression = require("../lib/zstd-compression");
var _lz4js = _interopRequireDefault(require("lz4js"));
var modules = {
  lz4js: _lz4js.default
};
var COMPRESSIONS = [new _noCompression.NoCompression({
  modules: modules
}), new _brotliCompression.BrotliCompression({
  modules: modules
}), new _deflateCompression.DeflateCompression({
  modules: modules
}), new _gzipCompression.GZipCompression({
  modules: modules
}), new _lz4Compression.LZ4Compression({
  modules: modules
}), new _snappyCompression.SnappyCompression({
  modules: modules
}), new _zstdCompression.ZstdCompression({
  modules: modules
})];
(0, _workerUtils.createWorker)(function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var options,
      operation,
      compression,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          operation = getOperation(String(options === null || options === void 0 ? void 0 : options.operation));
          compression = getCompression(String(options === null || options === void 0 ? void 0 : options.compression));
          _context.t0 = operation;
          _context.next = _context.t0 === 'compress' ? 6 : _context.t0 === 'decompress' ? 9 : 12;
          break;
        case 6:
          _context.next = 8;
          return compression.compress(data);
        case 8:
          return _context.abrupt("return", _context.sent);
        case 9:
          _context.next = 11;
          return compression.decompress(data);
        case 11:
          return _context.abrupt("return", _context.sent);
        case 12:
          throw new Error('invalid option');
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
function getOperation(operation) {
  switch (operation) {
    case 'compress':
    case 'deflate':
      return 'compress';
    case 'decompress':
    case 'inflate':
      return 'decompress';
    default:
      throw new Error("@loaders.gl/compression: Unsupported operation ".concat(operation, ". Expected 'compress' or 'decompress'"));
  }
}
function getCompression(name) {
  var Compression = COMPRESSIONS.find(function (compression_) {
    return name === compression_.name;
  });
  if (!Compression) {
    throw new Error("@loaders.gl/compression: Unsupported compression ".concat(name));
  }
  return Compression;
}
//# sourceMappingURL=worker.js.map