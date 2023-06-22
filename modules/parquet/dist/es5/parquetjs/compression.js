"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PARQUET_COMPRESSION_METHODS = void 0;
exports.decompress = decompress;
exports.deflate = deflate;
exports.inflate = inflate;
exports.preloadCompressions = preloadCompressions;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _compression = require("@loaders.gl/compression");
var _lz4js = _interopRequireDefault(require("lz4js"));
function toBuffer(arrayBuffer) {
  return Buffer.from(arrayBuffer);
}
function toArrayBuffer(buffer) {
  if (Buffer.isBuffer(buffer)) {
    var typedArray = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length);
    return typedArray.slice().buffer;
  }
  return buffer;
}
var modules = {
  lz4js: _lz4js.default
};
var PARQUET_COMPRESSION_METHODS = {
  UNCOMPRESSED: new _compression.NoCompression(),
  GZIP: new _compression.GZipCompression(),
  SNAPPY: new _compression.SnappyCompression(),
  BROTLI: new _compression.BrotliCompression({
    modules: modules
  }),
  LZ4: new _compression.LZ4Compression({
    modules: modules
  }),
  LZ4_RAW: new _compression.LZ4Compression({
    modules: modules
  }),
  ZSTD: new _compression.ZstdCompression({
    modules: modules
  })
};
exports.PARQUET_COMPRESSION_METHODS = PARQUET_COMPRESSION_METHODS;
function preloadCompressions(_x) {
  return _preloadCompressions.apply(this, arguments);
}
function _preloadCompressions() {
  _preloadCompressions = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(options) {
    var compressions;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          compressions = Object.values(PARQUET_COMPRESSION_METHODS);
          _context.next = 3;
          return Promise.all(compressions.map(function (compression) {
            return compression.preload();
          }));
        case 3:
          return _context.abrupt("return", _context.sent);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _preloadCompressions.apply(this, arguments);
}
function deflate(_x2, _x3) {
  return _deflate.apply(this, arguments);
}
function _deflate() {
  _deflate = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(method, value) {
    var compression, inputArrayBuffer, compressedArrayBuffer;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          compression = PARQUET_COMPRESSION_METHODS[method];
          if (compression) {
            _context2.next = 3;
            break;
          }
          throw new Error("parquet: invalid compression method: ".concat(method));
        case 3:
          inputArrayBuffer = toArrayBuffer(value);
          _context2.next = 6;
          return compression.compress(inputArrayBuffer);
        case 6:
          compressedArrayBuffer = _context2.sent;
          return _context2.abrupt("return", toBuffer(compressedArrayBuffer));
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _deflate.apply(this, arguments);
}
function decompress(_x4, _x5, _x6) {
  return _decompress.apply(this, arguments);
}
function _decompress() {
  _decompress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(method, value, size) {
    var compression, inputArrayBuffer, compressedArrayBuffer;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          compression = PARQUET_COMPRESSION_METHODS[method];
          if (compression) {
            _context3.next = 3;
            break;
          }
          throw new Error("parquet: invalid compression method: ".concat(method));
        case 3:
          inputArrayBuffer = toArrayBuffer(value);
          _context3.next = 6;
          return compression.decompress(inputArrayBuffer, size);
        case 6:
          compressedArrayBuffer = _context3.sent;
          return _context3.abrupt("return", toBuffer(compressedArrayBuffer));
        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _decompress.apply(this, arguments);
}
function inflate(method, value, size) {
  if (!(method in PARQUET_COMPRESSION_METHODS)) {
    throw new Error("invalid compression method: ".concat(method));
  }
  return PARQUET_COMPRESSION_METHODS[method].inflate(value, size);
}
//# sourceMappingURL=compression.js.map