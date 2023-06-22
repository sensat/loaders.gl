"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeTableFromData = makeTableFromData;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _tableSchema = require("./table-schema");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function makeTableFromData(data) {
  var table;
  switch (getTableShapeFromData(data)) {
    case 'array-row-table':
      table = {
        shape: 'array-row-table',
        data: data
      };
      break;
    case 'object-row-table':
      table = {
        shape: 'object-row-table',
        data: data
      };
      break;
    case 'columnar-table':
      table = {
        shape: 'columnar-table',
        data: data
      };
      break;
    default:
      throw new Error('table');
  }
  var schema = (0, _tableSchema.deduceTableSchema)(table);
  return _objectSpread(_objectSpread({}, table), {}, {
    schema: schema
  });
}
function getTableShapeFromData(data) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('cannot deduce type of empty table');
    }
    var firstRow = data[0];
    if (Array.isArray(firstRow)) {
      return 'array-row-table';
    }
    if (firstRow && (0, _typeof2.default)(firstRow) === 'object') {
      return 'object-row-table';
    }
  }
  if (data && (0, _typeof2.default)(data) === 'object') {
    return 'columnar-table';
  }
  throw new Error('invalid table');
}
//# sourceMappingURL=make-table.js.map