"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowLikeTable = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _arrowLikeSchema = require("./arrow-like-schema");
var _tableSchema = require("../simple-table/table-schema");
var _tableAccessors = require("../simple-table/table-accessors");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ArrowLikeVector = function () {
  function ArrowLikeVector(table, columnName) {
    (0, _classCallCheck2.default)(this, ArrowLikeVector);
    (0, _defineProperty2.default)(this, "table", void 0);
    (0, _defineProperty2.default)(this, "columnName", void 0);
    this.table = table;
    this.columnName = columnName;
  }
  (0, _createClass2.default)(ArrowLikeVector, [{
    key: "get",
    value: function get(rowIndex) {
      return (0, _tableAccessors.getTableCell)(this.table, rowIndex, this.columnName);
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var _this$table$data$getC;
      switch (this.table.shape) {
        case 'arrow-table':
          return (_this$table$data$getC = this.table.data.getChild(this.columnName)) === null || _this$table$data$getC === void 0 ? void 0 : _this$table$data$getC.toArray();
        case 'columnar-table':
          return this.table.data[this.columnName];
        default:
          throw new Error(this.table.shape);
      }
    }
  }]);
  return ArrowLikeVector;
}();
var ArrowLikeTable = function () {
  function ArrowLikeTable(table) {
    (0, _classCallCheck2.default)(this, ArrowLikeTable);
    (0, _defineProperty2.default)(this, "schema", void 0);
    (0, _defineProperty2.default)(this, "table", void 0);
    var schema = table.schema || (0, _tableSchema.deduceTableSchema)(table);
    this.schema = new _arrowLikeSchema.ArrowLikeSchema(schema.fields, schema.metadata);
    this.table = _objectSpread(_objectSpread({}, table), {}, {
      schema: schema
    });
  }
  (0, _createClass2.default)(ArrowLikeTable, [{
    key: "data",
    get: function get() {
      return this.table.data;
    }
  }, {
    key: "numCols",
    get: function get() {
      return (0, _tableAccessors.getTableNumCols)(this.table);
    }
  }, {
    key: "length",
    get: function get() {
      return (0, _tableAccessors.getTableLength)(this.table);
    }
  }, {
    key: "getChild",
    value: function getChild(columnName) {
      return new ArrowLikeVector(this.table, columnName);
    }
  }]);
  return ArrowLikeTable;
}();
exports.ArrowLikeTable = ArrowLikeTable;
//# sourceMappingURL=arrow-like-table.js.map