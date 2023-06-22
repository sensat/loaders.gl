"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetRowGroup = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var ParquetRowGroup = (0, _createClass2.default)(function ParquetRowGroup() {
  var rowCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var columnData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _classCallCheck2.default)(this, ParquetRowGroup);
  (0, _defineProperty2.default)(this, "rowCount", void 0);
  (0, _defineProperty2.default)(this, "columnData", void 0);
  this.rowCount = rowCount;
  this.columnData = columnData;
});
exports.ParquetRowGroup = ParquetRowGroup;
//# sourceMappingURL=declare.js.map