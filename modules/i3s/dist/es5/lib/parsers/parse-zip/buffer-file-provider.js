"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewFileProvider = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var DataViewFileProvider = function () {
  function DataViewFileProvider(file) {
    (0, _classCallCheck2.default)(this, DataViewFileProvider);
    (0, _defineProperty2.default)(this, "file", void 0);
    this.file = file;
  }
  (0, _createClass2.default)(DataViewFileProvider, [{
    key: "getUint8",
    value: function getUint8(offset) {
      return Promise.resolve(this.file.getUint8(offset));
    }
  }, {
    key: "getUint16",
    value: function getUint16(offset) {
      return Promise.resolve(this.file.getUint16(offset, true));
    }
  }, {
    key: "getUint32",
    value: function getUint32(offset) {
      return Promise.resolve(this.file.getUint32(offset, true));
    }
  }, {
    key: "slice",
    value: function slice(startOffset, endOffset) {
      return Promise.resolve(this.file.buffer.slice(startOffset, endOffset));
    }
  }, {
    key: "length",
    get: function get() {
      return this.file.byteLength;
    }
  }]);
  return DataViewFileProvider;
}();
exports.DataViewFileProvider = DataViewFileProvider;
//# sourceMappingURL=buffer-file-provider.js.map