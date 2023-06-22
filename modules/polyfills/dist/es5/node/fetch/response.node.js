"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Response = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _assert = require("../../utils/assert");
var _streamUtils = require("./utils/stream-utils.node");
var _headers = require("./headers.node");
var _stream = require("stream");
var isBoolean = function isBoolean(x) {
  return typeof x === 'boolean';
};
var isFunction = function isFunction(x) {
  return typeof x === 'function';
};
var isObject = function isObject(x) {
  return x !== null && (0, _typeof2.default)(x) === 'object';
};
var isReadableNodeStream = function isReadableNodeStream(x) {
  return isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
};
var Response = function () {
  function Response(body, options) {
    (0, _classCallCheck2.default)(this, Response);
    (0, _defineProperty2.default)(this, "ok", void 0);
    (0, _defineProperty2.default)(this, "status", void 0);
    (0, _defineProperty2.default)(this, "statusText", void 0);
    (0, _defineProperty2.default)(this, "headers", void 0);
    (0, _defineProperty2.default)(this, "url", void 0);
    (0, _defineProperty2.default)(this, "bodyUsed", false);
    (0, _defineProperty2.default)(this, "_body", void 0);
    var _ref = options || {},
      headers = _ref.headers,
      _ref$status = _ref.status,
      status = _ref$status === void 0 ? 200 : _ref$status,
      _ref$statusText = _ref.statusText,
      statusText = _ref$statusText === void 0 ? 'OK' : _ref$statusText,
      url = _ref.url;
    this.url = url;
    this.ok = status === 200;
    this.status = status;
    this.statusText = statusText;
    this.headers = new _headers.Headers((options === null || options === void 0 ? void 0 : options.headers) || {});
    if (isReadableNodeStream(body)) {
      this._body = (0, _streamUtils.decompressReadStream)(body, headers);
    } else if (typeof body === 'string') {
      this._body = _stream.Readable.from([new TextEncoder().encode(body)]);
    } else {
      this._body = _stream.Readable.from([body || new ArrayBuffer(0)]);
    }
  }
  (0, _createClass2.default)(Response, [{
    key: "body",
    get: function get() {
      (0, _assert.assert)(!this.bodyUsed);
      (0, _assert.assert)(isReadableNodeStream(this._body));
      this.bodyUsed = true;
      return this._body;
    }
  }, {
    key: "arrayBuffer",
    value: function () {
      var _arrayBuffer = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        var data;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (isReadableNodeStream(this._body)) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return", this._body || new ArrayBuffer(0));
            case 2:
              _context.next = 4;
              return (0, _streamUtils.concatenateReadStream)(this._body);
            case 4:
              data = _context.sent;
              return _context.abrupt("return", data);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function arrayBuffer() {
        return _arrayBuffer.apply(this, arguments);
      }
      return arrayBuffer;
    }()
  }, {
    key: "text",
    value: function () {
      var _text = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
        var arrayBuffer, textDecoder;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.arrayBuffer();
            case 2:
              arrayBuffer = _context2.sent;
              textDecoder = new TextDecoder();
              return _context2.abrupt("return", textDecoder.decode(arrayBuffer));
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function text() {
        return _text.apply(this, arguments);
      }
      return text;
    }()
  }, {
    key: "json",
    value: function () {
      var _json = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
        var text;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.text();
            case 2:
              text = _context3.sent;
              return _context3.abrupt("return", JSON.parse(text));
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function json() {
        return _json.apply(this, arguments);
      }
      return json;
    }()
  }, {
    key: "blob",
    value: function () {
      var _blob = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(typeof Blob === 'undefined')) {
                _context4.next = 2;
                break;
              }
              throw new Error('Blob polyfill not installed');
            case 2:
              _context4.t0 = Blob;
              _context4.next = 5;
              return this.arrayBuffer();
            case 5:
              _context4.t1 = _context4.sent;
              _context4.t2 = [_context4.t1];
              return _context4.abrupt("return", new _context4.t0(_context4.t2));
            case 8:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function blob() {
        return _blob.apply(this, arguments);
      }
      return blob;
    }()
  }]);
  return Response;
}();
exports.Response = Response;
//# sourceMappingURL=response.node.js.map