"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeflateCompression = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _asyncGeneratorDelegate2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncGeneratorDelegate"));
var _compression = require("./compression");
var _loaderUtils = require("@loaders.gl/loader-utils");
var _pako = _interopRequireDefault(require("pako"));
var _zlib = _interopRequireDefault(require("zlib"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var DeflateCompression = function (_Compression) {
  (0, _inherits2.default)(DeflateCompression, _Compression);
  var _super = _createSuper(DeflateCompression);
  function DeflateCompression() {
    var _this4;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, DeflateCompression);
    _this4 = _super.call(this, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "name", 'deflate');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "extensions", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "contentEncodings", ['deflate']);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "isSupported", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "options", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_chunks", []);
    _this4.options = options;
    return _this4;
  }
  (0, _createClass2.default)(DeflateCompression, [{
    key: "compress",
    value: function () {
      var _compress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(input) {
        var _this$options$deflate;
        var _this$options$deflate2, buffer;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!_loaderUtils.isBrowser && (_this$options$deflate = this.options.deflate) !== null && _this$options$deflate !== void 0 && _this$options$deflate.useZlib)) {
                _context.next = 12;
                break;
              }
              if (!((_this$options$deflate2 = this.options.deflate) !== null && _this$options$deflate2 !== void 0 && _this$options$deflate2.gzip)) {
                _context.next = 7;
                break;
              }
              _context.next = 4;
              return (0, _loaderUtils.promisify1)(_zlib.default.gzip)(input);
            case 4:
              _context.t0 = _context.sent;
              _context.next = 10;
              break;
            case 7:
              _context.next = 9;
              return (0, _loaderUtils.promisify1)(_zlib.default.deflate)(input);
            case 9:
              _context.t0 = _context.sent;
            case 10:
              buffer = _context.t0;
              return _context.abrupt("return", (0, _loaderUtils.toArrayBuffer)(buffer));
            case 12:
              return _context.abrupt("return", this.compressSync(input));
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function compress(_x) {
        return _compress.apply(this, arguments);
      }
      return compress;
    }()
  }, {
    key: "decompress",
    value: function () {
      var _decompress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(input) {
        var _this$options$deflate3;
        var _this$options$deflate4, buffer;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!_loaderUtils.isBrowser && (_this$options$deflate3 = this.options.deflate) !== null && _this$options$deflate3 !== void 0 && _this$options$deflate3.useZlib)) {
                _context2.next = 12;
                break;
              }
              if (!((_this$options$deflate4 = this.options.deflate) !== null && _this$options$deflate4 !== void 0 && _this$options$deflate4.gzip)) {
                _context2.next = 7;
                break;
              }
              _context2.next = 4;
              return (0, _loaderUtils.promisify1)(_zlib.default.gunzip)(input);
            case 4:
              _context2.t0 = _context2.sent;
              _context2.next = 10;
              break;
            case 7:
              _context2.next = 9;
              return (0, _loaderUtils.promisify1)(_zlib.default.inflate)(input);
            case 9:
              _context2.t0 = _context2.sent;
            case 10:
              buffer = _context2.t0;
              return _context2.abrupt("return", (0, _loaderUtils.toArrayBuffer)(buffer));
            case 12:
              return _context2.abrupt("return", this.decompressSync(input));
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function decompress(_x2) {
        return _decompress.apply(this, arguments);
      }
      return decompress;
    }()
  }, {
    key: "compressSync",
    value: function compressSync(input) {
      var _this$options$deflate5, _this$options;
      if (!_loaderUtils.isBrowser && (_this$options$deflate5 = this.options.deflate) !== null && _this$options$deflate5 !== void 0 && _this$options$deflate5.useZlib) {
        var _this$options$deflate6;
        var buffer = (_this$options$deflate6 = this.options.deflate) !== null && _this$options$deflate6 !== void 0 && _this$options$deflate6.gzip ? _zlib.default.gzipSync(input) : _zlib.default.deflateSync(input);
        return (0, _loaderUtils.toArrayBuffer)(buffer);
      }
      var pakoOptions = ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.deflate) || {};
      var inputArray = new Uint8Array(input);
      return _pako.default.deflate(inputArray, pakoOptions).buffer;
    }
  }, {
    key: "decompressSync",
    value: function decompressSync(input) {
      var _this$options$deflate7, _this$options2;
      if (!_loaderUtils.isBrowser && (_this$options$deflate7 = this.options.deflate) !== null && _this$options$deflate7 !== void 0 && _this$options$deflate7.useZlib) {
        var _this$options$deflate8;
        var buffer = (_this$options$deflate8 = this.options.deflate) !== null && _this$options$deflate8 !== void 0 && _this$options$deflate8.gzip ? _zlib.default.gunzipSync(input) : _zlib.default.inflateSync(input);
        return (0, _loaderUtils.toArrayBuffer)(buffer);
      }
      var pakoOptions = ((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.deflate) || {};
      var inputArray = new Uint8Array(input);
      return _pako.default.inflate(inputArray, pakoOptions).buffer;
    }
  }, {
    key: "compressBatches",
    value: function compressBatches(asyncIterator) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee3() {
        var _this$options3;
        var pakoOptions, pakoProcessor;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              pakoOptions = ((_this$options3 = _this.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.deflate) || {};
              pakoProcessor = new _pako.default.Deflate(pakoOptions);
              return _context3.delegateYield((0, _asyncGeneratorDelegate2.default)(_asyncIterator(_this.transformBatches(pakoProcessor, asyncIterator)), _awaitAsyncGenerator2.default), "t0", 3);
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }))();
    }
  }, {
    key: "decompressBatches",
    value: function decompressBatches(asyncIterator) {
      var _this2 = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee4() {
        var _this2$options;
        var pakoOptions, pakoProcessor;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              pakoOptions = ((_this2$options = _this2.options) === null || _this2$options === void 0 ? void 0 : _this2$options.deflate) || {};
              pakoProcessor = new _pako.default.Inflate(pakoOptions);
              return _context4.delegateYield((0, _asyncGeneratorDelegate2.default)(_asyncIterator(_this2.transformBatches(pakoProcessor, asyncIterator)), _awaitAsyncGenerator2.default), "t0", 3);
            case 3:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }))();
    }
  }, {
    key: "transformBatches",
    value: function transformBatches(pakoProcessor, asyncIterator) {
      var _this3 = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee5() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, uint8Array, _ok, _chunks, emptyChunk, ok, chunks;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              pakoProcessor.onData = _this3._onData.bind(_this3);
              pakoProcessor.onEnd = _this3._onEnd.bind(_this3);
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context5.prev = 4;
              _iterator = _asyncIterator(asyncIterator);
            case 6:
              _context5.next = 8;
              return (0, _awaitAsyncGenerator2.default)(_iterator.next());
            case 8:
              if (!(_iteratorAbruptCompletion = !(_step = _context5.sent).done)) {
                _context5.next = 19;
                break;
              }
              chunk = _step.value;
              uint8Array = new Uint8Array(chunk);
              _ok = pakoProcessor.push(uint8Array, false);
              if (_ok) {
                _context5.next = 14;
                break;
              }
              throw new Error("".concat(_this3._getError(), "write"));
            case 14:
              _chunks = _this3._getChunks();
              return _context5.delegateYield((0, _asyncGeneratorDelegate2.default)(_asyncIterator(_chunks), _awaitAsyncGenerator2.default), "t0", 16);
            case 16:
              _iteratorAbruptCompletion = false;
              _context5.next = 6;
              break;
            case 19:
              _context5.next = 25;
              break;
            case 21:
              _context5.prev = 21;
              _context5.t1 = _context5["catch"](4);
              _didIteratorError = true;
              _iteratorError = _context5.t1;
            case 25:
              _context5.prev = 25;
              _context5.prev = 26;
              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context5.next = 30;
                break;
              }
              _context5.next = 30;
              return (0, _awaitAsyncGenerator2.default)(_iterator.return());
            case 30:
              _context5.prev = 30;
              if (!_didIteratorError) {
                _context5.next = 33;
                break;
              }
              throw _iteratorError;
            case 33:
              return _context5.finish(30);
            case 34:
              return _context5.finish(25);
            case 35:
              emptyChunk = new Uint8Array(0);
              ok = pakoProcessor.push(emptyChunk, true);
              if (!ok) {}
              chunks = _this3._getChunks();
              return _context5.delegateYield((0, _asyncGeneratorDelegate2.default)(_asyncIterator(chunks), _awaitAsyncGenerator2.default), "t2", 40);
            case 40:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[4, 21, 25, 35], [26,, 30, 34]]);
      }))();
    }
  }, {
    key: "_onData",
    value: function _onData(chunk) {
      this._chunks.push(chunk);
    }
  }, {
    key: "_onEnd",
    value: function _onEnd(status) {
      if (status !== 0) {
        throw new Error(this._getError(status) + this._chunks.length);
      }
    }
  }, {
    key: "_getChunks",
    value: function _getChunks() {
      var chunks = this._chunks;
      this._chunks = [];
      return chunks;
    }
  }, {
    key: "_getError",
    value: function _getError() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var MESSAGES = {
        2: 'need dictionary',
        1: 'stream end',
        0: '',
        '-1': 'file error',
        '-2': 'stream error',
        '-3': 'data error',
        '-4': 'insufficient memory',
        '-5': 'buffer error',
        '-6': 'incompatible version'
      };
      return "".concat(this.name, ": ").concat(MESSAGES[code]);
    }
  }]);
  return DeflateCompression;
}(_compression.Compression);
exports.DeflateCompression = DeflateCompression;
//# sourceMappingURL=deflate-compression.js.map