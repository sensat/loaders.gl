"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RowGroup = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _nodeInt = _interopRequireDefault(require("node-int64"));
var thrift = _interopRequireWildcard(require("thrift"));
var ColumnChunk = _interopRequireWildcard(require("./ColumnChunk"));
var SortingColumn = _interopRequireWildcard(require("./SortingColumn"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var RowGroup = function () {
  function RowGroup(args) {
    (0, _classCallCheck2.default)(this, RowGroup);
    (0, _defineProperty2.default)(this, "columns", void 0);
    (0, _defineProperty2.default)(this, "total_byte_size", void 0);
    (0, _defineProperty2.default)(this, "num_rows", void 0);
    (0, _defineProperty2.default)(this, "sorting_columns", void 0);
    if (args != null && args.columns != null) {
      this.columns = args.columns;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[columns] is unset!');
    }
    if (args != null && args.total_byte_size != null) {
      if (typeof args.total_byte_size === 'number') {
        this.total_byte_size = new _nodeInt.default(args.total_byte_size);
      } else {
        this.total_byte_size = args.total_byte_size;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[total_byte_size] is unset!');
    }
    if (args != null && args.num_rows != null) {
      if (typeof args.num_rows === 'number') {
        this.num_rows = new _nodeInt.default(args.num_rows);
      } else {
        this.num_rows = args.num_rows;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_rows] is unset!');
    }
    if (args != null && args.sorting_columns != null) {
      this.sorting_columns = args.sorting_columns;
    }
  }
  (0, _createClass2.default)(RowGroup, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('RowGroup');
      if (this.columns != null) {
        output.writeFieldBegin('columns', thrift.Thrift.Type.LIST, 1);
        output.writeListBegin(thrift.Thrift.Type.STRUCT, this.columns.length);
        this.columns.forEach(function (value_1) {
          value_1.write(output);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      if (this.total_byte_size != null) {
        output.writeFieldBegin('total_byte_size', thrift.Thrift.Type.I64, 2);
        output.writeI64(this.total_byte_size);
        output.writeFieldEnd();
      }
      if (this.num_rows != null) {
        output.writeFieldBegin('num_rows', thrift.Thrift.Type.I64, 3);
        output.writeI64(this.num_rows);
        output.writeFieldEnd();
      }
      if (this.sorting_columns != null) {
        output.writeFieldBegin('sorting_columns', thrift.Thrift.Type.LIST, 4);
        output.writeListBegin(thrift.Thrift.Type.STRUCT, this.sorting_columns.length);
        this.sorting_columns.forEach(function (value_2) {
          value_2.write(output);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      output.writeFieldStop();
      output.writeStructEnd();
      return;
    }
  }], [{
    key: "read",
    value: function read(input) {
      input.readStructBegin();
      var _args = {};
      while (true) {
        var ret = input.readFieldBegin();
        var fieldType = ret.ftype;
        var fieldId = ret.fid;
        if (fieldType === thrift.Thrift.Type.STOP) {
          break;
        }
        switch (fieldId) {
          case 1:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_3 = new Array();
              var metadata_1 = input.readListBegin();
              var size_1 = metadata_1.size;
              for (var i_1 = 0; i_1 < size_1; i_1++) {
                var value_4 = ColumnChunk.ColumnChunk.read(input);
                value_3.push(value_4);
              }
              input.readListEnd();
              _args.columns = value_3;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_5 = input.readI64();
              _args.total_byte_size = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_6 = input.readI64();
              _args.num_rows = value_6;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_7 = new Array();
              var metadata_2 = input.readListBegin();
              var size_2 = metadata_2.size;
              for (var i_2 = 0; i_2 < size_2; i_2++) {
                var value_8 = SortingColumn.SortingColumn.read(input);
                value_7.push(value_8);
              }
              input.readListEnd();
              _args.sorting_columns = value_7;
            } else {
              input.skip(fieldType);
            }
            break;
          default:
            {
              input.skip(fieldType);
            }
        }
        input.readFieldEnd();
      }
      input.readStructEnd();
      if (_args.columns !== undefined && _args.total_byte_size !== undefined && _args.num_rows !== undefined) {
        return new RowGroup(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read RowGroup from input');
      }
    }
  }]);
  return RowGroup;
}();
exports.RowGroup = RowGroup;
//# sourceMappingURL=RowGroup.js.map