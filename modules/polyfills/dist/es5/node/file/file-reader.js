"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileReaderPolyfill = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _btoa = require("../buffer/btoa.node");
var FileReaderPolyfill = function () {
  function FileReaderPolyfill() {
    (0, _classCallCheck2.default)(this, FileReaderPolyfill);
    (0, _defineProperty2.default)(this, "onload", void 0);
    (0, _defineProperty2.default)(this, "onabort", void 0);
    (0, _defineProperty2.default)(this, "onerror", void 0);
    (0, _defineProperty2.default)(this, "error", void 0);
    (0, _defineProperty2.default)(this, "onloadstart", void 0);
    (0, _defineProperty2.default)(this, "onloadend", void 0);
    (0, _defineProperty2.default)(this, "onprogress", void 0);
    (0, _defineProperty2.default)(this, "readyState", void 0);
    (0, _defineProperty2.default)(this, "result", void 0);
    (0, _defineProperty2.default)(this, "DONE", void 0);
    (0, _defineProperty2.default)(this, "EMPTY", void 0);
    (0, _defineProperty2.default)(this, "LOADING", void 0);
    (0, _defineProperty2.default)(this, "addEventListener", void 0);
    (0, _defineProperty2.default)(this, "removeEventListener", void 0);
    (0, _defineProperty2.default)(this, "dispatchEvent", void 0);
    this.onload = null;
  }
  (0, _createClass2.default)(FileReaderPolyfill, [{
    key: "abort",
    value: function abort() {
      return;
    }
  }, {
    key: "readAsArrayBuffer",
    value: function () {
      var _readAsArrayBuffer = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(blob) {
        var arrayBuffer;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return blob.arrayBuffer();
            case 2:
              arrayBuffer = _context.sent;
              if (this.onload) {
                this.onload({
                  target: {
                    result: arrayBuffer
                  }
                });
              }
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function readAsArrayBuffer(_x) {
        return _readAsArrayBuffer.apply(this, arguments);
      }
      return readAsArrayBuffer;
    }()
  }, {
    key: "readAsBinaryString",
    value: function () {
      var _readAsBinaryString = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(blob) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              throw Error('Not implemented');
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function readAsBinaryString(_x2) {
        return _readAsBinaryString.apply(this, arguments);
      }
      return readAsBinaryString;
    }()
  }, {
    key: "readAsDataURL",
    value: function () {
      var _readAsDataURL = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(blob) {
        var text, dataUrl;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return blob.text();
            case 2:
              text = _context3.sent;
              dataUrl = "data://;base64,".concat((0, _btoa.atob)(text));
              if (this.onload) {
                this.onload({
                  target: {
                    result: dataUrl
                  }
                });
              }
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function readAsDataURL(_x3) {
        return _readAsDataURL.apply(this, arguments);
      }
      return readAsDataURL;
    }()
  }, {
    key: "readAsText",
    value: function () {
      var _readAsText = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(blob) {
        var text;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return blob.text();
            case 2:
              text = _context4.sent;
              if (this.onload) {
                this.onload({
                  target: {
                    result: text
                  }
                });
              }
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function readAsText(_x4) {
        return _readAsText.apply(this, arguments);
      }
      return readAsText;
    }()
  }]);
  return FileReaderPolyfill;
}();
exports.FileReaderPolyfill = FileReaderPolyfill;
//# sourceMappingURL=file-reader.js.map