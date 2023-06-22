"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeHash = void 0;
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
var _crypto = require("crypto");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var NodeHash = function (_Hash) {
  (0, _inherits2.default)(NodeHash, _Hash);
  var _super = _createSuper(NodeHash);
  function NodeHash(options) {
    var _this2$options, _this2$options$crypto;
    var _this2;
    (0, _classCallCheck2.default)(this, NodeHash);
    _this2 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "name", 'crypto-node');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "options", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "_algorithm", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "_hash", void 0);
    _this2.options = options;
    if (!((_this2$options = _this2.options) !== null && _this2$options !== void 0 && (_this2$options$crypto = _this2$options.crypto) !== null && _this2$options$crypto !== void 0 && _this2$options$crypto.algorithm)) {
      throw new Error(_this2.name);
    }
    return _this2;
  }
  (0, _createClass2.default)(NodeHash, [{
    key: "hash",
    value: function () {
      var _hash = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(input) {
        var _this$options, _this$options$crypto, _this$options$crypto$;
        var hash, inputArray;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.preload();
            case 2:
              hash = (0, _crypto.createHash)((_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$crypto = _this$options.crypto) === null || _this$options$crypto === void 0 ? void 0 : (_this$options$crypto$ = _this$options$crypto.algorithm) === null || _this$options$crypto$ === void 0 ? void 0 : _this$options$crypto$.toLowerCase());
              inputArray = new Uint8Array(input);
              return _context.abrupt("return", hash.update(inputArray).digest('base64'));
            case 5:
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
    key: "hashBatches",
    value: function hashBatches(asyncIterator) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee2() {
        var _this$options2, _this$options2$crypto, _this$options2$crypto2, _this$options3, _this$options3$crypto, _this$options3$crypto2;
        var hash, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, inputArray;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _awaitAsyncGenerator2.default)(_this.preload());
            case 2:
              hash = (0, _crypto.createHash)((_this$options2 = _this.options) === null || _this$options2 === void 0 ? void 0 : (_this$options2$crypto = _this$options2.crypto) === null || _this$options2$crypto === void 0 ? void 0 : (_this$options2$crypto2 = _this$options2$crypto.algorithm) === null || _this$options2$crypto2 === void 0 ? void 0 : _this$options2$crypto2.toLowerCase());
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context2.prev = 5;
              _iterator = _asyncIterator(asyncIterator);
            case 7:
              _context2.next = 9;
              return (0, _awaitAsyncGenerator2.default)(_iterator.next());
            case 9:
              if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                _context2.next = 18;
                break;
              }
              chunk = _step.value;
              inputArray = new Uint8Array(chunk);
              hash.update(inputArray);
              _context2.next = 15;
              return chunk;
            case 15:
              _iteratorAbruptCompletion = false;
              _context2.next = 7;
              break;
            case 18:
              _context2.next = 24;
              break;
            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](5);
              _didIteratorError = true;
              _iteratorError = _context2.t0;
            case 24:
              _context2.prev = 24;
              _context2.prev = 25;
              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context2.next = 29;
                break;
              }
              _context2.next = 29;
              return (0, _awaitAsyncGenerator2.default)(_iterator.return());
            case 29:
              _context2.prev = 29;
              if (!_didIteratorError) {
                _context2.next = 32;
                break;
              }
              throw _iteratorError;
            case 32:
              return _context2.finish(29);
            case 33:
              return _context2.finish(24);
            case 34:
              (_this$options3 = _this.options) === null || _this$options3 === void 0 ? void 0 : (_this$options3$crypto = _this$options3.crypto) === null || _this$options3$crypto === void 0 ? void 0 : (_this$options3$crypto2 = _this$options3$crypto.onEnd) === null || _this$options3$crypto2 === void 0 ? void 0 : _this$options3$crypto2.call(_this$options3$crypto, {
                hash: hash.digest('base64')
              });
            case 35:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[5, 20, 24, 34], [25,, 29, 33]]);
      }))();
    }
  }]);
  return NodeHash;
}(_hash2.Hash);
exports.NodeHash = NodeHash;
//# sourceMappingURL=node-hash.js.map