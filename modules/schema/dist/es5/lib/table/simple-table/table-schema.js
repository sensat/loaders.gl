"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deduceSchema = deduceSchema;
exports.deduceTableSchema = deduceTableSchema;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _dataType = require("./data-type");
function deduceTableSchema(table) {
  switch (table.shape) {
    case 'array-row-table':
    case 'object-row-table':
      return deduceSchemaFromRows(table.data);
    case 'columnar-table':
      return deduceSchemaFromColumns(table.data);
    case 'arrow-table':
    default:
      throw new Error('Deduce schema');
  }
}
function deduceSchema(data) {
  return Array.isArray(data) ? deduceSchemaFromRows(data) : deduceSchemaFromColumns(data);
}
function deduceSchemaFromColumns(columnarTable) {
  var fields = [];
  for (var _i = 0, _Object$entries = Object.entries(columnarTable); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
      columnName = _Object$entries$_i[0],
      column = _Object$entries$_i[1];
    var field = deduceFieldFromColumn(column, columnName);
    fields.push(field);
  }
  return {
    fields: fields,
    metadata: {}
  };
}
function deduceSchemaFromRows(rowTable) {
  if (!rowTable.length) {
    throw new Error('deduce from empty table');
  }
  var fields = [];
  var row0 = rowTable[0];
  for (var _i2 = 0, _Object$entries2 = Object.entries(row0); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = (0, _slicedToArray2.default)(_Object$entries2[_i2], 2),
      columnName = _Object$entries2$_i[0],
      value = _Object$entries2$_i[1];
    fields.push(deduceFieldFromValue(value, columnName));
  }
  return {
    fields: fields,
    metadata: {}
  };
}
function deduceFieldFromColumn(column, name) {
  if (ArrayBuffer.isView(column)) {
    var type = (0, _dataType.getDataTypeFromArray)(column);
    return {
      name: name,
      type: type.type || 'null',
      nullable: type.nullable
    };
  }
  if (Array.isArray(column) && column.length > 0) {
    var value = column[0];
    var _type = (0, _dataType.getDataTypeFromValue)(value);
    return {
      name: name,
      type: _type,
      nullable: true
    };
  }
  throw new Error('empty table');
}
function deduceFieldFromValue(value, name) {
  var type = (0, _dataType.getDataTypeFromValue)(value);
  return {
    name: name,
    type: type,
    nullable: true
  };
}
//# sourceMappingURL=table-schema.js.map