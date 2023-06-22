"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _queue = require("./queue");
var _process = _interopRequireDefault(require("process"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MEMORY_LIMIT = 4 * 1024 * 1024 * 1024;
var WriteQueue = function (_Queue) {
  (0, _inherits2.default)(WriteQueue, _Queue);
  var _super = _createSuper(WriteQueue);
  function WriteQueue() {
    var _this;
    var listeningInterval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2000;
    var writeConcurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
    (0, _classCallCheck2.default)(this, WriteQueue);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "intervalId", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "writePromise", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "fileMap", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "listeningInterval", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "writeConcurrency", void 0);
    _this.listeningInterval = listeningInterval;
    _this.writeConcurrency = writeConcurrency;
    return _this;
  }
  (0, _createClass2.default)(WriteQueue, [{
    key: "enqueue",
    value: function () {
      var _enqueue = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(val) {
        var writeImmediately,
          _ref,
          archiveKey,
          writePromise,
          result,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              writeImmediately = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
              if (!writeImmediately) {
                _context.next = 9;
                break;
              }
              _ref = val, archiveKey = _ref.archiveKey, writePromise = _ref.writePromise;
              _context.next = 5;
              return writePromise();
            case 5:
              result = _context.sent;
              if (archiveKey && result) {
                this.fileMap[archiveKey] = result;
              }
              _context.next = 13;
              break;
            case 9:
              (0, _get2.default)((0, _getPrototypeOf2.default)(WriteQueue.prototype), "enqueue", this).call(this, val);
              if (!(_process.default.memoryUsage().rss > MEMORY_LIMIT)) {
                _context.next = 13;
                break;
              }
              _context.next = 13;
              return this.startWrite();
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function enqueue(_x) {
        return _enqueue.apply(this, arguments);
      }
      return enqueue;
    }()
  }, {
    key: "startListening",
    value: function startListening() {
      this.intervalId = setInterval(this.startWrite.bind(this), this.listeningInterval);
    }
  }, {
    key: "stopListening",
    value: function stopListening() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  }, {
    key: "startWrite",
    value: function () {
      var _startWrite = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.writePromise) {
                this.writePromise = this.doWrite();
              }
              _context2.next = 3;
              return this.writePromise;
            case 3:
              this.writePromise = null;
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function startWrite() {
        return _startWrite.apply(this, arguments);
      }
      return startWrite;
    }()
  }, {
    key: "finalize",
    value: function () {
      var _finalize = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              this.stopListening();
              _context3.next = 3;
              return this.startWrite();
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function finalize() {
        return _finalize.apply(this, arguments);
      }
      return finalize;
    }()
  }, {
    key: "doWrite",
    value: function () {
      var _doWrite = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
        var promises, archiveKeys, i, item, _ref2, archiveKey, writePromise, promise, writeResults;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!this.length) {
                _context4.next = 21;
                break;
              }
              promises = [];
              archiveKeys = [];
              i = 0;
            case 4:
              if (!(i < this.writeConcurrency)) {
                _context4.next = 15;
                break;
              }
              item = this.dequeue();
              if (item) {
                _context4.next = 8;
                break;
              }
              return _context4.abrupt("break", 15);
            case 8:
              _ref2 = item, archiveKey = _ref2.archiveKey, writePromise = _ref2.writePromise;
              archiveKeys.push(archiveKey);
              promise = writePromise();
              promises.push(promise);
            case 12:
              i++;
              _context4.next = 4;
              break;
            case 15:
              _context4.next = 17;
              return Promise.allSettled(promises);
            case 17:
              writeResults = _context4.sent;
              this.updateFileMap(archiveKeys, writeResults);
              _context4.next = 0;
              break;
            case 21:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function doWrite() {
        return _doWrite.apply(this, arguments);
      }
      return doWrite;
    }()
  }, {
    key: "updateFileMap",
    value: function updateFileMap(archiveKeys, writeResults) {
      for (var i = 0; i < archiveKeys.length; i++) {
        var archiveKey = archiveKeys[i];
        if (archiveKey && 'value' in writeResults[i]) {
          this.fileMap[archiveKey] = writeResults[i].value;
        }
      }
    }
  }]);
  return WriteQueue;
}(_queue.Queue);
exports.default = WriteQueue;
//# sourceMappingURL=write-queue.js.map