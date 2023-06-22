"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortingColumn = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var SortingColumn = function () {
  function SortingColumn(args) {
    (0, _classCallCheck2.default)(this, SortingColumn);
    (0, _defineProperty2.default)(this, "column_idx", void 0);
    (0, _defineProperty2.default)(this, "descending", void 0);
    (0, _defineProperty2.default)(this, "nulls_first", void 0);
    if (args != null && args.column_idx != null) {
      this.column_idx = args.column_idx;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[column_idx] is unset!');
    }
    if (args != null && args.descending != null) {
      this.descending = args.descending;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[descending] is unset!');
    }
    if (args != null && args.nulls_first != null) {
      this.nulls_first = args.nulls_first;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[nulls_first] is unset!');
    }
  }
  (0, _createClass2.default)(SortingColumn, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('SortingColumn');
      if (this.column_idx != null) {
        output.writeFieldBegin('column_idx', thrift.Thrift.Type.I32, 1);
        output.writeI32(this.column_idx);
        output.writeFieldEnd();
      }
      if (this.descending != null) {
        output.writeFieldBegin('descending', thrift.Thrift.Type.BOOL, 2);
        output.writeBool(this.descending);
        output.writeFieldEnd();
      }
      if (this.nulls_first != null) {
        output.writeFieldBegin('nulls_first', thrift.Thrift.Type.BOOL, 3);
        output.writeBool(this.nulls_first);
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
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_1 = input.readI32();
              _args.column_idx = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.BOOL) {
              var value_2 = input.readBool();
              _args.descending = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.BOOL) {
              var value_3 = input.readBool();
              _args.nulls_first = value_3;
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
      if (_args.column_idx !== undefined && _args.descending !== undefined && _args.nulls_first !== undefined) {
        return new SortingColumn(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read SortingColumn from input');
      }
    }
  }]);
  return SortingColumn;
}();
exports.SortingColumn = SortingColumn;
//# sourceMappingURL=SortingColumn.js.map