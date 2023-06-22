"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnIndex = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _nodeInt = _interopRequireDefault(require("node-int64"));
var thrift = _interopRequireWildcard(require("thrift"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var ColumnIndex = function () {
  function ColumnIndex(args) {
    (0, _classCallCheck2.default)(this, ColumnIndex);
    (0, _defineProperty2.default)(this, "null_pages", void 0);
    (0, _defineProperty2.default)(this, "min_values", void 0);
    (0, _defineProperty2.default)(this, "max_values", void 0);
    (0, _defineProperty2.default)(this, "boundary_order", void 0);
    (0, _defineProperty2.default)(this, "null_counts", void 0);
    if (args != null && args.null_pages != null) {
      this.null_pages = args.null_pages;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[null_pages] is unset!');
    }
    if (args != null && args.min_values != null) {
      this.min_values = args.min_values;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[min_values] is unset!');
    }
    if (args != null && args.max_values != null) {
      this.max_values = args.max_values;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[max_values] is unset!');
    }
    if (args != null && args.boundary_order != null) {
      this.boundary_order = args.boundary_order;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[boundary_order] is unset!');
    }
    if (args != null && args.null_counts != null) {
      this.null_counts = args.null_counts.map(function (c) {
        return new _nodeInt.default(+c);
      });
    }
  }
  (0, _createClass2.default)(ColumnIndex, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('ColumnIndex');
      if (this.null_pages != null) {
        output.writeFieldBegin('null_pages', thrift.Thrift.Type.LIST, 1);
        output.writeListBegin(thrift.Thrift.Type.BOOL, this.null_pages.length);
        this.null_pages.forEach(function (value_1) {
          output.writeBool(value_1);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      if (this.min_values != null) {
        output.writeFieldBegin('min_values', thrift.Thrift.Type.LIST, 2);
        output.writeListBegin(thrift.Thrift.Type.STRING, this.min_values.length);
        this.min_values.forEach(function (value_2) {
          output.writeBinary(value_2);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      if (this.max_values != null) {
        output.writeFieldBegin('max_values', thrift.Thrift.Type.LIST, 3);
        output.writeListBegin(thrift.Thrift.Type.STRING, this.max_values.length);
        this.max_values.forEach(function (value_3) {
          output.writeBinary(value_3);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      if (this.boundary_order != null) {
        output.writeFieldBegin('boundary_order', thrift.Thrift.Type.I32, 4);
        output.writeI32(this.boundary_order);
        output.writeFieldEnd();
      }
      if (this.null_counts != null) {
        output.writeFieldBegin('null_counts', thrift.Thrift.Type.LIST, 5);
        output.writeListBegin(thrift.Thrift.Type.I64, this.null_counts.length);
        this.null_counts.forEach(function (value_4) {
          output.writeI64(value_4);
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
              var value_5 = new Array();
              var metadata_1 = input.readListBegin();
              var size_1 = metadata_1.size;
              for (var i_1 = 0; i_1 < size_1; i_1++) {
                var value_6 = input.readBool();
                value_5.push(value_6);
              }
              input.readListEnd();
              _args.null_pages = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_7 = new Array();
              var metadata_2 = input.readListBegin();
              var size_2 = metadata_2.size;
              for (var i_2 = 0; i_2 < size_2; i_2++) {
                var value_8 = input.readBinary();
                value_7.push(value_8);
              }
              input.readListEnd();
              _args.min_values = value_7;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_9 = new Array();
              var metadata_3 = input.readListBegin();
              var size_3 = metadata_3.size;
              for (var i_3 = 0; i_3 < size_3; i_3++) {
                var value_10 = input.readBinary();
                value_9.push(value_10);
              }
              input.readListEnd();
              _args.max_values = value_9;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_11 = input.readI32();
              _args.boundary_order = value_11;
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_12 = new Array();
              var metadata_4 = input.readListBegin();
              var size_4 = metadata_4.size;
              for (var i_4 = 0; i_4 < size_4; i_4++) {
                var value_13 = input.readI64();
                value_12.push(value_13);
              }
              input.readListEnd();
              _args.null_counts = value_12;
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
      if (_args.null_pages !== undefined && _args.min_values !== undefined && _args.max_values !== undefined && _args.boundary_order !== undefined) {
        return new ColumnIndex(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read ColumnIndex from input');
      }
    }
  }]);
  return ColumnIndex;
}();
exports.ColumnIndex = ColumnIndex;
//# sourceMappingURL=ColumnIndex.js.map