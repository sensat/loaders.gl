"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CRC32CHash = void 0;
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
var _crc32c = _interopRequireDefault(require("./algorithms/crc32c"));
var _digestUtils = require("./utils/digest-utils");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var CRC32CHash = function (_Hash) {
  (0, _inherits2.default)(CRC32CHash, _Hash);
  var _super = _createSuper(CRC32CHash);
  function CRC32CHash() {
    var _this2;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, CRC32CHash);
    _this2 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "name", 'crc32c');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "options", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "_hash", void 0);
    _this2.options = _objectSpread({
      crypto: {}
    }, options);
    _this2._hash = new _crc32c.default(options);
    return _this2;
  }
  (0, _createClass2.default)(CRC32CHash, [{
    key: "hash",
    value: function () {
      var _hash = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(input) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this.hashSync(input));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function hash(_x) {
        return _hash.apply(this, arguments);
      }
      return hash;
    }()
  }, {
    key: "hashSync",
    value: function hashSync(input) {
      this._hash.update(input);
      var hashValue = this._hash.finalize();
      var hex = (0, _digestUtils.toHex)(hashValue);
      var hash = (0, _digestUtils.hexToBase64)(hex);
      return hash;
    }
  }, {
    key: "hashBatches",
    value: function hashBatches(asyncIterator) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee2() {
        var _this$options$crypto, _this$options$crypto$;
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, hashValue, hex, hash;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context2.prev = 2;
              _iterator = _asyncIterator(asyncIterator);
            case 4:
              _context2.next = 6;
              return (0, _awaitAsyncGenerator2.default)(_iterator.next());
            case 6:
              if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                _context2.next = 14;
                break;
              }
              chunk = _step.value;
              _this._hash.update(chunk);
              _context2.next = 11;
              return chunk;
            case 11:
              _iteratorAbruptCompletion = false;
              _context2.next = 4;
              break;
            case 14:
              _context2.next = 20;
              break;
            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](2);
              _didIteratorError = true;
              _iteratorError = _context2.t0;
            case 20:
              _context2.prev = 20;
              _context2.prev = 21;
              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context2.next = 25;
                break;
              }
              _context2.next = 25;
              return (0, _awaitAsyncGenerator2.default)(_iterator.return());
            case 25:
              _context2.prev = 25;
              if (!_didIteratorError) {
                _context2.next = 28;
                break;
              }
              throw _iteratorError;
            case 28:
              return _context2.finish(25);
            case 29:
              return _context2.finish(20);
            case 30:
              hashValue = _this._hash.finalize();
              hex = (0, _digestUtils.toHex)(hashValue);
              hash = (0, _digestUtils.hexToBase64)(hex);
              (_this$options$crypto = _this.options.crypto) === null || _this$options$crypto === void 0 ? void 0 : (_this$options$crypto$ = _this$options$crypto.onEnd) === null || _this$options$crypto$ === void 0 ? void 0 : _this$options$crypto$.call(_this$options$crypto, {
                hash: hash
              });
            case 34:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[2, 16, 20, 30], [21,, 25, 29]]);
      }))();
    }
  }]);
  return CRC32CHash;
}(_hash2.Hash);
exports.CRC32CHash = CRC32CHash;
//# sourceMappingURL=crc32c-hash.js.map