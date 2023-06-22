"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hash = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _loaderUtils = require("@loaders.gl/loader-utils");
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var Hash = function () {
  function Hash() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Hash);
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    this.hashBatches = this.hashBatches.bind(this);
  }
  (0, _createClass2.default)(Hash, [{
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
    key: "hashBatches",
    value: function hashBatches(asyncIterator) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee2() {
        var _this$options$crypto, _this$options$crypto$;
        var arrayBuffers, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _arrayBuffer, output, hash;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              arrayBuffers = [];
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context2.prev = 3;
              _iterator = _asyncIterator(asyncIterator);
            case 5:
              _context2.next = 7;
              return (0, _awaitAsyncGenerator2.default)(_iterator.next());
            case 7:
              if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                _context2.next = 15;
                break;
              }
              _arrayBuffer = _step.value;
              arrayBuffers.push(_arrayBuffer);
              _context2.next = 12;
              return _arrayBuffer;
            case 12:
              _iteratorAbruptCompletion = false;
              _context2.next = 5;
              break;
            case 15:
              _context2.next = 21;
              break;
            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2["catch"](3);
              _didIteratorError = true;
              _iteratorError = _context2.t0;
            case 21:
              _context2.prev = 21;
              _context2.prev = 22;
              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context2.next = 26;
                break;
              }
              _context2.next = 26;
              return (0, _awaitAsyncGenerator2.default)(_iterator.return());
            case 26:
              _context2.prev = 26;
              if (!_didIteratorError) {
                _context2.next = 29;
                break;
              }
              throw _iteratorError;
            case 29:
              return _context2.finish(26);
            case 30:
              return _context2.finish(21);
            case 31:
              _context2.next = 33;
              return (0, _awaitAsyncGenerator2.default)(_this.concatenate(arrayBuffers));
            case 33:
              output = _context2.sent;
              _context2.next = 36;
              return (0, _awaitAsyncGenerator2.default)(_this.hash(output));
            case 36:
              hash = _context2.sent;
              (_this$options$crypto = _this.options.crypto) === null || _this$options$crypto === void 0 ? void 0 : (_this$options$crypto$ = _this$options$crypto.onEnd) === null || _this$options$crypto$ === void 0 ? void 0 : _this$options$crypto$.call(_this$options$crypto, {
                hash: hash
              });
            case 38:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[3, 17, 21, 31], [22,, 26, 30]]);
      }))();
    }
  }, {
    key: "concatenate",
    value: function () {
      var _concatenate = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(asyncIterator) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _loaderUtils.concatenateArrayBuffersAsync)(asyncIterator);
            case 2:
              return _context3.abrupt("return", _context3.sent);
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function concatenate(_x) {
        return _concatenate.apply(this, arguments);
      }
      return concatenate;
    }()
  }]);
  return Hash;
}();
exports.Hash = Hash;
//# sourceMappingURL=hash.js.map