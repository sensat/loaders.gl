"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatenateArrayBuffers = concatenateArrayBuffers;
exports.concatenateReadStream = concatenateReadStream;
exports.decompressReadStream = decompressReadStream;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _zlib = _interopRequireDefault(require("zlib"));
var _decodeDataUri = require("./decode-data-uri.node");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function decompressReadStream(readStream, headers) {
  switch (headers.get('content-encoding')) {
    case 'br':
      return readStream.pipe(_zlib.default.createBrotliDecompress());
    case 'gzip':
      return readStream.pipe(_zlib.default.createGunzip());
    case 'deflate':
      return readStream.pipe(_zlib.default.createDeflate());
    default:
      return readStream;
  }
}
function concatenateReadStream(_x) {
  return _concatenateReadStream.apply(this, arguments);
}
function _concatenateReadStream() {
  _concatenateReadStream = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(readStream) {
    var arrayBufferChunks;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          arrayBufferChunks = [];
          _context.next = 3;
          return new Promise(function (resolve, reject) {
            readStream.on('error', function (error) {
              return reject(error);
            });
            readStream.on('readable', function () {
              return readStream.read();
            });
            readStream.on('data', function (chunk) {
              if (typeof chunk === 'string') {
                reject(new Error('Read stream not binary'));
              }
              arrayBufferChunks.push((0, _decodeDataUri.toArrayBuffer)(chunk));
            });
            readStream.on('end', function () {
              var arrayBuffer = concatenateArrayBuffers(arrayBufferChunks);
              resolve(arrayBuffer);
            });
          });
        case 3:
          return _context.abrupt("return", _context.sent);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _concatenateReadStream.apply(this, arguments);
}
function concatenateArrayBuffers(sources) {
  var sourceArrays = sources.map(function (source2) {
    return source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2;
  });
  var byteLength = sourceArrays.reduce(function (length, typedArray) {
    return length + typedArray.byteLength;
  }, 0);
  var result = new Uint8Array(byteLength);
  var offset = 0;
  var _iterator = _createForOfIteratorHelper(sourceArrays),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var sourceArray = _step.value;
      result.set(sourceArray, offset);
      offset += sourceArray.byteLength;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result.buffer;
}
//# sourceMappingURL=stream-utils.node.js.map