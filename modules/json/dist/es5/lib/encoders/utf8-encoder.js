"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utf8ArrayBufferEncoder = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var Utf8ArrayBufferEncoder = function () {
  function Utf8ArrayBufferEncoder(chunkSize) {
    (0, _classCallCheck2.default)(this, Utf8ArrayBufferEncoder);
    (0, _defineProperty2.default)(this, "chunkSize", void 0);
    (0, _defineProperty2.default)(this, "strings", []);
    (0, _defineProperty2.default)(this, "totalLength", 0);
    (0, _defineProperty2.default)(this, "textEncoder", new TextEncoder());
    this.chunkSize = chunkSize;
  }
  (0, _createClass2.default)(Utf8ArrayBufferEncoder, [{
    key: "push",
    value: function push() {
      for (var _len = arguments.length, strings = new Array(_len), _key = 0; _key < _len; _key++) {
        strings[_key] = arguments[_key];
      }
      for (var _i = 0, _strings = strings; _i < _strings.length; _i++) {
        var string = _strings[_i];
        this.strings.push(string);
        this.totalLength += string.length;
      }
    }
  }, {
    key: "isFull",
    value: function isFull() {
      return this.totalLength >= this.chunkSize;
    }
  }, {
    key: "getArrayBufferBatch",
    value: function getArrayBufferBatch() {
      return this.textEncoder.encode(this.getStringBatch()).buffer;
    }
  }, {
    key: "getStringBatch",
    value: function getStringBatch() {
      var stringChunk = this.strings.join('');
      this.strings = [];
      this.totalLength = 0;
      return stringChunk;
    }
  }]);
  return Utf8ArrayBufferEncoder;
}();
exports.Utf8ArrayBufferEncoder = Utf8ArrayBufferEncoder;
//# sourceMappingURL=utf8-encoder.js.map