"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertParquetRowGroupToColumns = convertParquetRowGroupToColumns;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
function convertParquetRowGroupToColumns(schema, rowGroup) {
  var columns = {};
  for (var _i = 0, _Object$entries = Object.entries(rowGroup.columnData); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
      columnName = _Object$entries$_i[0],
      data = _Object$entries$_i[1];
    columns[columnName] = columns[columnName] || data.values;
  }
  return columns;
}
//# sourceMappingURL=convert-row-group-to-columns.js.map