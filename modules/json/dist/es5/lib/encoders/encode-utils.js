"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectGeometryColumnIndex = detectGeometryColumnIndex;
exports.getRowPropertyObject = getRowPropertyObject;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _schema = require("@loaders.gl/schema");
function detectGeometryColumnIndex(table) {
  var _table$schema$fields$, _table$schema;
  var geometryIndex = (_table$schema$fields$ = (_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields.findIndex(function (field) {
    return field.name === 'geometry';
  })) !== null && _table$schema$fields$ !== void 0 ? _table$schema$fields$ : -1;
  if (geometryIndex > -1) {
    return geometryIndex;
  }
  if ((0, _schema.getTableLength)(table) > 0) {
    var row = (0, _schema.getTableRowAsArray)(table, 0);
    for (var columnIndex = 0; columnIndex < (0, _schema.getTableNumCols)(table); columnIndex++) {
      var value = row === null || row === void 0 ? void 0 : row[columnIndex];
      if (value && (0, _typeof2.default)(value) === 'object') {
        return columnIndex;
      }
    }
  }
  throw new Error('Failed to detect geometry column');
}
function getRowPropertyObject(table, row) {
  var excludeColumnIndices = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var properties = {};
  for (var columnIndex = 0; columnIndex < (0, _schema.getTableNumCols)(table); ++columnIndex) {
    var _table$schema2;
    var _columnName = (_table$schema2 = table.schema) === null || _table$schema2 === void 0 ? void 0 : _table$schema2.fields[columnIndex].name;
    if (_columnName && !excludeColumnIndices.includes(columnIndex)) {
      properties[_columnName] = row[_columnName];
    }
  }
  return properties;
}
//# sourceMappingURL=encode-utils.js.map