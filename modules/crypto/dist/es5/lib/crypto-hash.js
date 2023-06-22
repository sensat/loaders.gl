"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CryptoHash = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _hash2 = require("./hash");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var CryptoJS;
var CryptoHash = function (_Hash) {
  (0, _inherits2.default)(CryptoHash, _Hash);
  var _super = _createSuper(CryptoHash);
  function CryptoHash(options) {
    var _this2$options, _this2$options$crypto;
    var _this2;
    (0, _classCallCheck2.default)(this, CryptoHash);
    _this2 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "name", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "options", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "_algorithm", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "_hash", void 0);
    _this2.options = options;
    _this2._algorithm = (_this2$options = _this2.options) === null || _this2$options === void 0 ? void 0 : (_this2$options$crypto = _this2$options.crypto) === null || _this2$options$crypto === void 0 ? void 0 : _this2$options$crypto.algorithm;
    if (!_this2._algorithm) {
      throw new Error(_this2.name);
    }
    _this2.name = _this2._algorithm.toLowerCase();
    return _this2;
  }
  (0, _createClass2.default)(CryptoHash, [{
    key: "preload",
    value: function () {
      var _preload = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        var _this$options, _this$options$modules, algo;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (CryptoJS) {
                _context.next = 4;
                break;
              }
              CryptoJS = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules.CryptoJS;
              if (CryptoJS) {
                _context.next = 4;
                break;
              }
              throw new Error(this.name);
            case 4:
              if (!this._hash) {
                algo = CryptoJS.algo[this._algorithm];
                this._hash = algo.create();
              }
              if (this._hash) {
                _context.next = 7;
                break;
              }
              throw new Error(this.name);
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function preload() {
        return _preload.apply(this, arguments);
      }
      return preload;
    }()
  }, {
    key: "hash",
    value: function () {
      var _hash = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(input) {
        var typedWordArray;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.preload();
            case 2:
              typedWordArray = CryptoJS.lib.WordArray.create(input);
              return _context2.abrupt("return", this._hash.update(typedWordArray).finalize().toString(CryptoJS.enc.Base64));
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function hash(_x) {
        return _hash.apply(this, arguments);
      }
      return hash;
    }()
  }, {
    key: "hashBatches",
    value: function hashBatches(asyncIterator) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee3() {
        var _this$options2, _this$options2$crypto, _this$options2$crypto2;
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, typedWordArray, hash;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _awaitAsyncGenerator2.default)(_this.preload());
            case 2:
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context3.prev = 4;
              _iterator = _asyncIterator(asyncIterator);
            case 6:
              _context3.next = 8;
              return (0, _awaitAsyncGenerator2.default)(_iterator.next());
            case 8:
              if (!(_iteratorAbruptCompletion = !(_step = _context3.sent).done)) {
                _context3.next = 17;
                break;
              }
              chunk = _step.value;
              typedWordArray = CryptoJS.lib.WordArray.create(chunk);
              _this._hash.update(typedWordArray);
              _context3.next = 14;
              return chunk;
            case 14:
              _iteratorAbruptCompletion = false;
              _context3.next = 6;
              break;
            case 17:
              _context3.next = 23;
              break;
            case 19:
              _context3.prev = 19;
              _context3.t0 = _context3["catch"](4);
              _didIteratorError = true;
              _iteratorError = _context3.t0;
            case 23:
              _context3.prev = 23;
              _context3.prev = 24;
              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context3.next = 28;
                break;
              }
              _context3.next = 28;
              return (0, _awaitAsyncGenerator2.default)(_iterator.return());
            case 28:
              _context3.prev = 28;
              if (!_didIteratorError) {
                _context3.next = 31;
                break;
              }
              throw _iteratorError;
            case 31:
              return _context3.finish(28);
            case 32:
              return _context3.finish(23);
            case 33:
              hash = _this._hash.finalize().toString(CryptoJS.enc.Base64);
              (_this$options2 = _this.options) === null || _this$options2 === void 0 ? void 0 : (_this$options2$crypto = _this$options2.crypto) === null || _this$options2$crypto === void 0 ? void 0 : (_this$options2$crypto2 = _this$options2$crypto.onEnd) === null || _this$options2$crypto2 === void 0 ? void 0 : _this$options2$crypto2.call(_this$options2$crypto, {
                hash: hash
              });
            case 35:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[4, 19, 23, 33], [24,, 28, 32]]);
      }))();
    }
  }]);
  return CryptoHash;
}(_hash2.Hash);
exports.CryptoHash = CryptoHash;
//# sourceMappingURL=crypto-hash.js.map