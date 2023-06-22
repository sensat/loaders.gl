"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeArrayRowTable = makeArrayRowTable;
exports.makeColumnarTable = makeColumnarTable;
exports.makeObjectRowTable = makeObjectRowTable;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _tableAccessors = require("./table-accessors");
var _tableSchema = require("./table-schema");
var _tableColumn = require("./table-column");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function makeColumnarTable(table) {
  var _table$schema;
  var schema = table.schema || (0, _tableSchema.deduceTableSchema)(table);
  var fields = ((_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields) || [];
  if (table.shape === 'columnar-table') {
    return _objectSpread(_objectSpread({}, table), {}, {
      schema: schema
    });
  }
  var length = (0, _tableAccessors.getTableLength)(table);
  var columns = {};
  var _iterator = _createForOfIteratorHelper(fields),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var field = _step.value;
      var _column = (0, _tableColumn.makeColumnFromField)(field, length);
      columns[field.name] = _column;
      for (var rowIndex = 0; rowIndex < length; rowIndex++) {
        _column[rowIndex] = (0, _tableAccessors.getTableCell)(table, rowIndex, field.name);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    shape: 'columnar-table',
    schema: schema,
    data: columns
  };
}
function makeArrayRowTable(table) {
  if (table.shape === 'array-row-table') {
    return table;
  }
  var length = (0, _tableAccessors.getTableLength)(table);
  var data = new Array(length);
  for (var rowIndex = 0; rowIndex < length; rowIndex++) {
    data[rowIndex] = (0, _tableAccessors.getTableRowAsArray)(table, rowIndex);
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
  var length = (0, _tableAccessors.getTableLength)(table);
  var data = new Array(length);
  for (var rowIndex = 0; rowIndex < length; rowIndex++) {
    data[rowIndex] = (0, _tableAccessors.getTableRowAsObject)(table, rowIndex);
  }
  return {
    shape: 'object-row-table',
    schema: table.schema,
    data: data
  };
}
//# sourceMappingURL=convert-table.js.map