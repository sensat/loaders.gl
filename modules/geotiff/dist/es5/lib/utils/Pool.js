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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _globalThis$navigator, _globalThis$navigator2;
var defaultPoolSize = (_globalThis$navigator = globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$navigator2 = globalThis.navigator) === null || _globalThis$navigator2 === void 0 ? void 0 : _globalThis$navigator2.hardwareConcurrency) !== null && _globalThis$navigator !== void 0 ? _globalThis$navigator : 4;
var Pool = function () {
  function Pool() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultPoolSize;
    (0, _classCallCheck2.default)(this, Pool);
    (0, _defineProperty2.default)(this, "workers", void 0);
    (0, _defineProperty2.default)(this, "idleWorkers", void 0);
    (0, _defineProperty2.default)(this, "waitQueue", void 0);
    (0, _defineProperty2.default)(this, "decoder", void 0);
    this.workers = [];
    this.idleWorkers = [];
    this.waitQueue = [];
    this.decoder = null;
    for (var i = 0; i < size; ++i) {
      var w = new Worker('./decoder.worker');
      this.workers.push(w);
      this.idleWorkers.push(w);
    }
  }
  (0, _createClass2.default)(Pool, [{
    key: "decode",
    value: function () {
      var _decode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(fileDirectory, buffer) {
        var _this = this;
        var currentWorker;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.waitForWorker();
            case 2:
              currentWorker = _context.sent;
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                currentWorker.onmessage = function (event) {
                  _this.finishTask(currentWorker);
                  resolve(event.data[0]);
                };
                currentWorker.onerror = function (error) {
                  _this.finishTask(currentWorker);
                  reject(error);
                };
                currentWorker.postMessage(['decode', fileDirectory, buffer], [buffer]);
              }));
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function decode(_x, _x2) {
        return _decode.apply(this, arguments);
      }
      return decode;
    }()
  }, {
    key: "waitForWorker",
    value: function () {
      var _waitForWorker = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
        var idleWorker, waiter, promise;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              idleWorker = this.idleWorkers.pop();
              if (!idleWorker) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return", idleWorker);
            case 3:
              waiter = {};
              promise = new Promise(function (resolve) {
                waiter.resolve = resolve;
              });
              this.waitQueue.push(waiter);
              return _context2.abrupt("return", promise);
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function waitForWorker() {
        return _waitForWorker.apply(this, arguments);
      }
      return waitForWorker;
    }()
  }, {
    key: "finishTask",
    value: function () {
      var _finishTask = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(currentWorker) {
        var waiter;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              waiter = this.waitQueue.pop();
              if (waiter) {
                waiter.resolve(currentWorker);
              } else {
                this.idleWorkers.push(currentWorker);
              }
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function finishTask(_x3) {
        return _finishTask.apply(this, arguments);
      }
      return finishTask;
    }()
  }, {
    key: "destroy",
    value: function destroy() {
      for (var i = 0; i < this.workers.length; ++i) {
        this.workers[i].terminate();
      }
    }
  }]);
  return Pool;
}();
exports.default = Pool;
//# sourceMappingURL=Pool.js.map