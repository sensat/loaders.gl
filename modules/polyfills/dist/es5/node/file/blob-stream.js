"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlobStream = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
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
var _readableStream = require("./readable-stream");
var _blobStreamController = require("./blob-stream-controller");
var _Symbol$asyncIterator;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
_Symbol$asyncIterator = Symbol.asyncIterator;
var BlobStream = function (_ReadableStreamPolyfi) {
  (0, _inherits2.default)(BlobStream, _ReadableStreamPolyfi);
  var _super = _createSuper(BlobStream);
  function BlobStream(chunks) {
    var _this2;
    (0, _classCallCheck2.default)(this, BlobStream);
    _this2 = _super.call(this, new _blobStreamController.BlobStreamController(chunks.values()), {
      type: 'bytes'
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "_chunks", void 0);
    _this2._chunks = chunks;
    return _this2;
  }
  (0, _createClass2.default)(BlobStream, [{
    key: _Symbol$asyncIterator,
    value: function value(_options) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee() {
        var reader;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              reader = _this.getReader();
              return _context.delegateYield((0, _asyncGeneratorDelegate2.default)(_asyncIterator(_this._chunks), _awaitAsyncGenerator2.default), "t0", 2);
            case 2:
              reader.releaseLock();
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    }
  }]);
  return BlobStream;
}(_readableStream.ReadableStreamPolyfill);
exports.BlobStream = BlobStream;
//# sourceMappingURL=blob-stream.js.map