"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlobPolyfill = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _blobStream = require("./blob-stream");
var _Symbol$toStringTag;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
_Symbol$toStringTag = Symbol.toStringTag;
var BlobPolyfill = function () {
  function BlobPolyfill() {
    var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, BlobPolyfill);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "size", void 0);
    (0, _defineProperty2.default)(this, "parts", void 0);
    this.parts = [];
    this.size = 0;
    var _iterator = _createForOfIteratorHelper(init),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var part = _step.value;
        if (typeof part === 'string') {
          var bytes = new TextEncoder().encode(part);
          this.parts.push(bytes);
          this.size += bytes.byteLength;
        } else if (part instanceof BlobPolyfill) {
          var _this$parts;
          this.size += part.size;
          (_this$parts = this.parts).push.apply(_this$parts, (0, _toConsumableArray2.default)(part.parts));
        } else if (part instanceof ArrayBuffer) {
          this.parts.push(new Uint8Array(part));
          this.size += part.byteLength;
        } else if (part instanceof Uint8Array) {
          this.parts.push(part);
          this.size += part.byteLength;
        } else if (ArrayBuffer.isView(part)) {
          var buffer = part.buffer,
            byteOffset = part.byteOffset,
            byteLength = part.byteLength;
          this.parts.push(new Uint8Array(buffer, byteOffset, byteLength));
          this.size += byteLength;
        } else {
          var _bytes = new TextEncoder().encode(String(part));
          this.parts.push(_bytes);
          this.size += _bytes.byteLength;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    this.type = readType(options.type);
  }
  (0, _createClass2.default)(BlobPolyfill, [{
    key: "slice",
    value: function slice() {
      var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.size;
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var size = this.size,
        parts = this.parts;
      var offset = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
      var limit = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
      var span = Math.max(limit - offset, 0);
      var blob = new BlobPolyfill([], {
        type: type
      });
      if (span === 0) {
        return blob;
      }
      var blobSize = 0;
      var blobParts = [];
      var _iterator2 = _createForOfIteratorHelper(parts),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var part = _step2.value;
          var byteLength = part.byteLength;
          if (offset > 0 && byteLength <= offset) {
            offset -= byteLength;
            limit -= byteLength;
          } else {
            var chunk = part.subarray(offset, Math.min(byteLength, limit));
            blobParts.push(chunk);
            blobSize += chunk.byteLength;
            offset = 0;
            if (blobSize >= span) {
              break;
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      blob.parts = blobParts;
      blob.size = blobSize;
      return blob;
    }
  }, {
    key: "arrayBuffer",
    value: function () {
      var _arrayBuffer = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this._toArrayBuffer());
            case 1:
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
        var decoder, text, _iterator3, _step3, part;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              decoder = new TextDecoder();
              text = '';
              _iterator3 = _createForOfIteratorHelper(this.parts);
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  part = _step3.value;
                  text += decoder.decode(part);
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
              return _context2.abrupt("return", text);
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
    key: "stream",
    value: function stream() {
      return new _blobStream.BlobStream(this.parts);
    }
  }, {
    key: "toString",
    value: function toString() {
      return '[object Blob]';
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return 'Blob';
    }
  }, {
    key: "_toArrayBuffer",
    value: function _toArrayBuffer() {
      var buffer = new ArrayBuffer(this.size);
      var bytes = new Uint8Array(buffer);
      var offset = 0;
      var _iterator4 = _createForOfIteratorHelper(this.parts),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var part = _step4.value;
          bytes.set(part, offset);
          offset += part.byteLength;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      return buffer;
    }
  }]);
  return BlobPolyfill;
}();
exports.BlobPolyfill = BlobPolyfill;
function readType() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var type = String(input).toLowerCase();
  return /[^\u0020-\u007E]/.test(type) ? '' : type;
}
//# sourceMappingURL=blob.js.map