"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compression = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _loaderUtils = require("@loaders.gl/loader-utils");
var Compression = function () {
  function Compression(options) {
    (0, _classCallCheck2.default)(this, Compression);
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "extensions", void 0);
    (0, _defineProperty2.default)(this, "contentEncodings", void 0);
    (0, _defineProperty2.default)(this, "isSupported", void 0);
    this.compressBatches = this.compressBatches.bind(this);
    this.decompressBatches = this.decompressBatches.bind(this);
  }
  (0, _createClass2.default)(Compression, [{
    key: "preload",
    value: function () {
      var _preload = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return");
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function preload() {
        return _preload.apply(this, arguments);
      }
      return preload;
    }()
  }, {
    key: "compress",
    value: function () {
      var _compress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(input) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.preload();
            case 2:
              return _context2.abrupt("return", this.compressSync(input));
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function compress(_x) {
        return _compress.apply(this, arguments);
      }
      return compress;
    }()
  }, {
    key: "decompress",
    value: function () {
      var _decompress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(input, size) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.preload();
            case 2:
              return _context3.abrupt("return", this.decompressSync(input, size));
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function decompress(_x2, _x3) {
        return _decompress.apply(this, arguments);
      }
      return decompress;
    }()
  }, {
    key: "compressSync",
    value: function compressSync(input) {
      throw new Error("".concat(this.name, ": sync compression not supported"));
    }
  }, {
    key: "decompressSync",
    value: function decompressSync(input, size) {
      throw new Error("".concat(this.name, ": sync decompression not supported"));
    }
  }, {
    key: "compressBatches",
    value: function compressBatches(asyncIterator) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee4() {
        var input;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _awaitAsyncGenerator2.default)(_this.concatenate(asyncIterator));
            case 2:
              input = _context4.sent;
              _context4.next = 5;
              return _this.compress(input);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }))();
    }
  }, {
    key: "decompressBatches",
    value: function decompressBatches(asyncIterator) {
      var _this2 = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee5() {
        var input;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _awaitAsyncGenerator2.default)(_this2.concatenate(asyncIterator));
            case 2:
              input = _context5.sent;
              _context5.next = 5;
              return _this2.decompress(input);
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }))();
    }
  }, {
    key: "concatenate",
    value: function concatenate(asyncIterator) {
      return (0, _loaderUtils.concatenateArrayBuffersAsync)(asyncIterator);
    }
  }, {
    key: "improveError",
    value: function improveError(error) {
      if (!error.message.includes(this.name)) {
        error.message = "".concat(this.name, " ").concat(error.message);
      }
      return error;
    }
  }]);
  return Compression;
}();
exports.Compression = Compression;
//# sourceMappingURL=compression.js.map