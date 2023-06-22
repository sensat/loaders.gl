"use strict";

var _regeneratorRuntime2 = require("@babel/runtime/regenerator");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTableCell = getTableCell;
exports.getTableCellAt = getTableCellAt;
exports.getTableColumnIndex = getTableColumnIndex;
exports.getTableColumnName = getTableColumnName;
exports.getTableLength = getTableLength;
exports.getTableNumCols = getTableNumCols;
exports.getTableRowAsArray = getTableRowAsArray;
exports.getTableRowAsObject = getTableRowAsObject;
exports.getTableRowShape = getTableRowShape;
exports.makeArrayRowIterator = makeArrayRowIterator;
exports.makeArrayRowTable = makeArrayRowTable;
exports.makeColumnarTable = makeColumnarTable;
exports.makeObjectRowIterator = makeObjectRowIterator;
exports.makeObjectRowTable = makeObjectRowTable;
exports.makeRowIterator = makeRowIterator;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _marked = _regeneratorRuntime2.mark(makeRowIterator);
function getTableLength(table) {
  switch (table.shape) {
    case 'array-row-table':
    case 'object-row-table':
    case 'geojson-row-table':
      return table.data.length;
    case 'arrow-table':
      return table.data.numRows;
    case 'columnar-table':
      for (var _i = 0, _Object$values = Object.values(table.data); _i < _Object$values.length; _i++) {
        var column = _Object$values[_i];
        return column.length || 0;
      }
      return 0;
    default:
      throw new Error('table');
  }
}
function getTableNumCols(table) {
  if (table.schema) {
    return table.schema.fields.length;
  }
  if (getTableLength(table) === 0) {
    throw new Error('empty table');
  }
  switch (table.shape) {
    case 'array-row-table':
      return table.data[0].length;
    case 'object-row-table':
    case 'geojson-row-table':
      return Object.keys(table.data[0]).length;
    case 'columnar-table':
      return Object.keys(table.data).length;
    case 'arrow-table':
      return table.data.numCols;
    default:
      throw new Error('table');
  }
}
function getTableCell(table, rowIndex, columnName) {
  var _table$data$getChildA;
  switch (table.shape) {
    case 'array-row-table':
      var columnIndex = getTableColumnIndex(table, columnName);
      return table.data[rowIndex][columnIndex];
    case 'object-row-table':
    case 'geojson-row-table':
      return table.data[rowIndex][columnName];
    case 'columnar-table':
      var column = table.data[columnName];
      return column[rowIndex];
    case 'arrow-table':
      var arrowColumnIndex = table.data.schema.fields.findIndex(function (field) {
        return field.name === columnName;
      });
      return (_table$data$getChildA = table.data.getChildAt(arrowColumnIndex)) === null || _table$data$getChildA === void 0 ? void 0 : _table$data$getChildA.get(rowIndex);
    default:
      throw new Error('todo');
  }
}
function getTableCellAt(table, rowIndex, columnIndex) {
  var _table$data$getChildA2;
  switch (table.shape) {
    case 'array-row-table':
      return table.data[rowIndex][columnIndex];
    case 'object-row-table':
    case 'geojson-row-table':
      var _columnName = getTableColumnName(table, columnIndex);
      return table.data[rowIndex][_columnName];
    case 'columnar-table':
      _columnName = getTableColumnName(table, columnIndex);
      var column = table.data[_columnName];
      return column[rowIndex];
    case 'arrow-table':
      return (_table$data$getChildA2 = table.data.getChildAt(columnIndex)) === null || _table$data$getChildA2 === void 0 ? void 0 : _table$data$getChildA2.get(rowIndex);
    default:
      throw new Error('todo');
  }
}
function getTableRowShape(table) {
  switch (table.shape) {
    case 'array-row-table':
    case 'object-row-table':
      return table.shape;
    case 'geojson-row-table':
      return 'object-row-table';
    case 'columnar-table':
    default:
      throw new Error('Not a row table');
  }
}
function getTableColumnIndex(table, columnName) {
  var _table$schema;
  var columnIndex = (_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields.findIndex(function (field) {
    return field.name === columnName;
  });
  if (columnIndex === undefined) {
    throw new Error(columnName);
  }
  return columnIndex;
}
function getTableColumnName(table, columnIndex) {
  var _table$schema2, _table$schema2$fields;
  var columnName = (_table$schema2 = table.schema) === null || _table$schema2 === void 0 ? void 0 : (_table$schema2$fields = _table$schema2.fields[columnIndex]) === null || _table$schema2$fields === void 0 ? void 0 : _table$schema2$fields.name;
  if (!columnName) {
    throw new Error("".concat(columnIndex));
  }
  return columnName;
}
function getTableRowAsObject(table, rowIndex, target, copy) {
  switch (table.shape) {
    case 'object-row-table':
      return copy ? Object.fromEntries(Object.entries(table.data[rowIndex])) : table.data[rowIndex];
    case 'array-row-table':
    case 'geojson-row-table':
      if (table.schema) {
        var _objectRow = target || {};
        for (var i = 0; i < table.schema.fields.length; i++) {
          _objectRow[table.schema.fields[i].name] = table.data[rowIndex][i];
        }
        return _objectRow;
      }
      throw new Error('no schema');
    case 'columnar-table':
      if (table.schema) {
        var _objectRow2 = target || {};
        for (var _i2 = 0; _i2 < table.schema.fields.length; _i2++) {
          _objectRow2[table.schema.fields[_i2].name] = table.data[table.schema.fields[_i2].name][rowIndex];
        }
        return _objectRow2;
      } else {
        var _objectRow3 = target || {};
        for (var _i3 = 0, _Object$entries = Object.entries(table.data); _i3 < _Object$entries.length; _i3++) {
          var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i3], 2),
            name = _Object$entries$_i[0],
            column = _Object$entries$_i[1];
          _objectRow3[name] = column[rowIndex];
        }
        return _objectRow3;
      }
    case 'arrow-table':
      var objectRow = target || {};
      var row = table.data.get(rowIndex);
      var schema = table.data.schema;
      for (var _i4 = 0; _i4 < schema.fields.length; _i4++) {
        objectRow[schema.fields[_i4].name] = row === null || row === void 0 ? void 0 : row[schema.fields[_i4].name];
      }
      return objectRow;
    default:
      throw new Error('shape');
  }
}
function getTableRowAsArray(table, rowIndex, target, copy) {
  switch (table.shape) {
    case 'array-row-table':
      return copy ? Array.from(table.data[rowIndex]) : table.data[rowIndex];
    case 'object-row-table':
    case 'geojson-row-table':
      if (table.schema) {
        var _arrayRow = target || [];
        for (var i = 0; i < table.schema.fields.length; i++) {
          _arrayRow[i] = table.data[rowIndex][table.schema.fields[i].name];
        }
        return _arrayRow;
      }
      return Object.values(table.data[rowIndex]);
    case 'columnar-table':
      if (table.schema) {
        var _arrayRow2 = target || [];
        for (var _i5 = 0; _i5 < table.schema.fields.length; _i5++) {
          _arrayRow2[_i5] = table.data[table.schema.fields[_i5].name][rowIndex];
        }
        return _arrayRow2;
      } else {
        var _arrayRow3 = target || [];
        var _i6 = 0;
        for (var _i7 = 0, _Object$values2 = Object.values(table.data); _i7 < _Object$values2.length; _i7++) {
          var column = _Object$values2[_i7];
          _arrayRow3[_i6] = column[rowIndex];
          _i6++;
        }
        return _arrayRow3;
      }
    case 'arrow-table':
      var arrayRow = target || [];
      var row = table.data.get(rowIndex);
      var schema = table.data.schema;
      for (var _i8 = 0; _i8 < schema.fields.length; _i8++) {
        arrayRow[_i8] = row === null || row === void 0 ? void 0 : row[schema.fields[_i8].name];
      }
      return arrayRow;
    default:
      throw new Error('shape');
  }
}
function makeArrayRowTable(table) {
  if (table.shape === 'array-row-table') {
    return table;
  }
  var length = getTableLength(table);
  var data = new Array(length);
  for (var rowIndex = 0; rowIndex < length; rowIndex++) {
    data[rowIndex] = getTableRowAsArray(table, rowIndex);
  }
  return {
    shape: 'array-row-table',
    schema: table.schema,
    data: data
  };
}
function makeObjectRowTable(table) {
  if (table.shape === 'object-row-table') {
    return table;
  }
  var length = getTableLength(table);
  var data = new Array(length);
  for (var rowIndex = 0; rowIndex < length; rowIndex++) {
    data[rowIndex] = getTableRowAsObject(table, rowIndex);
  }
  return {
    shape: 'object-row-table',
    schema: table.schema,
    data: data
  };
}
function makeColumnarTable(table) {
  if (table.shape === 'object-row-table') {
    return table;
  }
  var length = getTableLength(table);
  var data = new Array(length);
  for (var rowIndex = 0; rowIndex < length; rowIndex++) {
    data[rowIndex] = getTableRowAsObject(table, rowIndex);
  }
  return {
    shape: 'object-row-table',
    schema: table.schema,
    data: data
  };
}
function makeRowIterator(table, shape) {
  return _regenerator.default.wrap(function makeRowIterator$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.t0 = shape;
        _context.next = _context.t0 === 'array-row-table' ? 3 : _context.t0 === 'object-row-table' ? 5 : 7;
        break;
      case 3:
        return _context.delegateYield(makeArrayRowIterator(table), "t1", 4);
      case 4:
        return _context.abrupt("break", 8);
      case 5:
        return _context.delegateYield(makeObjectRowIterator(table), "t2", 6);
      case 6:
        return _context.abrupt("break", 8);
      case 7:
        throw new Error("Unknown row type ".concat(shape));
      case 8:
      case "end":
        return _context.stop();
    }
  }, _marked);
}
function makeArrayRowIterator(table) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return _regenerator.default.mark(function _callee() {
    var length, rowIndex;
    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          length = getTableLength(table);
          rowIndex = 0;
        case 2:
          if (!(rowIndex < length)) {
            _context2.next = 8;
            break;
          }
          _context2.next = 5;
          return getTableRowAsArray(table, rowIndex, target);
        case 5:
          rowIndex++;
          _context2.next = 2;
          break;
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee);
  })();
}
function makeObjectRowIterator(table) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _regenerator.default.mark(function _callee2() {
    var length, rowIndex;
    return _regenerator.default.wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          length = getTableLength(table);
          rowIndex = 0;
        case 2:
          if (!(rowIndex < length)) {
            _context3.next = 8;
            break;
          }
          _context3.next = 5;
          return getTableRowAsObject(table, rowIndex, target);
        case 5:
          rowIndex++;
          _context3.next = 2;
          break;
        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee2);
  })();
}
//# sourceMappingURL=table-accessors.js.map