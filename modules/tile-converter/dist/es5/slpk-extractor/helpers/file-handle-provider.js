"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileHandleProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _fs = require("fs");
var FileHandleProvider = function () {
  function FileHandleProvider(fileDescriptor, size) {
    (0, _classCallCheck2.default)(this, FileHandleProvider);
    (0, _defineProperty2.default)(this, "fileDescriptor", void 0);
    (0, _defineProperty2.default)(this, "size", void 0);
    this.fileDescriptor = fileDescriptor;
    this.size = size;
  }
  (0, _createClass2.default)(FileHandleProvider, [{
    key: "getUint8",
    value: function () {
      var _getUint = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(offset) {
        var val;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = Uint8Array;
              _context.next = 3;
              return this.fileDescriptor.read(Buffer.alloc(1), 0, 1, offset);
            case 3:
              _context.t1 = _context.sent.buffer.buffer;
              val = new _context.t0(_context.t1).at(0);
              if (!(val === undefined)) {
                _context.next = 7;
                break;
              }
              throw new Error('something went wrong');
            case 7:
              return _context.abrupt("return", val);
            case 8:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getUint8(_x) {
        return _getUint.apply(this, arguments);
      }
      return getUint8;
    }()
  }, {
    key: "getUint16",
    value: function () {
      var _getUint2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(offset) {
        var val;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = Uint16Array;
              _context2.next = 3;
              return this.fileDescriptor.read(Buffer.alloc(2), 0, 2, offset);
            case 3:
              _context2.t1 = _context2.sent.buffer.buffer;
              val = new _context2.t0(_context2.t1).at(0);
              if (!(val === undefined)) {
                _context2.next = 7;
                break;
              }
              throw new Error('something went wrong');
            case 7:
              return _context2.abrupt("return", val);
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getUint16(_x2) {
        return _getUint2.apply(this, arguments);
      }
      return getUint16;
    }()
  }, {
    key: "getUint32",
    value: function () {
      var _getUint3 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(offset) {
        var val;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.t0 = Uint32Array;
              _context3.next = 3;
              return this.fileDescriptor.read(Buffer.alloc(4), 0, 4, offset);
            case 3:
              _context3.t1 = _context3.sent.buffer.buffer;
              val = new _context3.t0(_context3.t1).at(0);
              if (!(val === undefined)) {
                _context3.next = 7;
                break;
              }
              throw new Error('something went wrong');
            case 7:
              return _context3.abrupt("return", val);
            case 8:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getUint32(_x3) {
        return _getUint3.apply(this, arguments);
      }
      return getUint32;
    }()
  }, {
    key: "slice",
    value: function () {
      var _slice = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(startOffset, endOffset) {
        var length;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              length = endOffset - startOffset;
              _context4.next = 3;
              return this.fileDescriptor.read(Buffer.alloc(length), 0, length, startOffset);
            case 3:
              return _context4.abrupt("return", _context4.sent.buffer.buffer);
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function slice(_x4, _x5) {
        return _slice.apply(this, arguments);
      }
      return slice;
    }()
  }, {
    key: "length",
    get: function get() {
      return this.size;
    }
  }], [{
    key: "from",
    value: function () {
      var _from = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(path) {
        var fileDescriptor;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _fs.promises.open(path);
            case 2:
              fileDescriptor = _context5.sent;
              _context5.t0 = FileHandleProvider;
              _context5.t1 = fileDescriptor;
              _context5.next = 7;
              return fileDescriptor.stat();
            case 7:
              _context5.t2 = _context5.sent.size;
              return _context5.abrupt("return", new _context5.t0(_context5.t1, _context5.t2));
            case 9:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function from(_x6) {
        return _from.apply(this, arguments);
      }
      return from;
    }()
  }]);
  return FileHandleProvider;
}();
exports.FileHandleProvider = FileHandleProvider;
//# sourceMappingURL=file-handle-provider.js.map