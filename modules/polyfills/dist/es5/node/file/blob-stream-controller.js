"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlobStreamController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var BlobStreamController = function () {
  function BlobStreamController(chunks) {
    (0, _classCallCheck2.default)(this, BlobStreamController);
    (0, _defineProperty2.default)(this, "chunks", void 0);
    (0, _defineProperty2.default)(this, "isWorking", false);
    (0, _defineProperty2.default)(this, "isCancelled", false);
    this.chunks = chunks;
  }
  (0, _createClass2.default)(BlobStreamController, [{
    key: "start",
    value: function start(controller) {
      this.work(controller);
    }
  }, {
    key: "work",
    value: function () {
      var _work = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(controller) {
        var chunks, next;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              chunks = this.chunks;
              this.isWorking = true;
            case 2:
              if (!(!this.isCancelled && (controller.desiredSize || 0) > 0)) {
                _context.next = 15;
                break;
              }
              next = void 0;
              _context.prev = 4;
              next = chunks.next();
              _context.next = 12;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](4);
              controller.error(_context.t0);
              return _context.abrupt("break", 15);
            case 12:
              if (next) {
                if (!next.done && !this.isCancelled) {
                  controller.enqueue(next.value);
                } else {
                  controller.close();
                }
              }
              _context.next = 2;
              break;
            case 15:
              this.isWorking = false;
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[4, 8]]);
      }));
      function work(_x) {
        return _work.apply(this, arguments);
      }
      return work;
    }()
  }, {
    key: "pull",
    value: function pull(controller) {
      if (!this.isWorking) {
        this.work(controller);
      }
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.isCancelled = true;
    }
  }]);
  return BlobStreamController;
}();
exports.BlobStreamController = BlobStreamController;
//# sourceMappingURL=blob-stream-controller.js.map