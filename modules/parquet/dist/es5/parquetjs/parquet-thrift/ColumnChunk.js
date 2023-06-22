"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnChunk = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _nodeInt = _interopRequireDefault(require("node-int64"));
var thrift = _interopRequireWildcard(require("thrift"));
var ColumnMetaData = _interopRequireWildcard(require("./ColumnMetaData"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var ColumnChunk = function () {
  function ColumnChunk(args) {
    (0, _classCallCheck2.default)(this, ColumnChunk);
    (0, _defineProperty2.default)(this, "file_path", void 0);
    (0, _defineProperty2.default)(this, "file_offset", void 0);
    (0, _defineProperty2.default)(this, "meta_data", void 0);
    (0, _defineProperty2.default)(this, "offset_index_offset", void 0);
    (0, _defineProperty2.default)(this, "offset_index_length", void 0);
    (0, _defineProperty2.default)(this, "column_index_offset", void 0);
    (0, _defineProperty2.default)(this, "column_index_length", void 0);
    if (args != null && args.file_path != null) {
      this.file_path = args.file_path;
    }
    if (args != null && args.file_offset != null) {
      if (typeof args.file_offset === 'number') {
        this.file_offset = new _nodeInt.default(args.file_offset);
      } else {
        this.file_offset = args.file_offset;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[file_offset] is unset!');
    }
    if (args != null && args.meta_data != null) {
      this.meta_data = args.meta_data;
    }
    if (args != null && args.offset_index_offset != null) {
      if (typeof args.offset_index_offset === 'number') {
        this.offset_index_offset = new _nodeInt.default(args.offset_index_offset);
      } else {
        this.offset_index_offset = args.offset_index_offset;
      }
    }
    if (args != null && args.offset_index_length != null) {
      this.offset_index_length = args.offset_index_length;
    }
    if (args != null && args.column_index_offset != null) {
      if (typeof args.column_index_offset === 'number') {
        this.column_index_offset = new _nodeInt.default(args.column_index_offset);
      } else {
        this.column_index_offset = args.column_index_offset;
      }
    }
    if (args != null && args.column_index_length != null) {
      this.column_index_length = args.column_index_length;
    }
  }
  (0, _createClass2.default)(ColumnChunk, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('ColumnChunk');
      if (this.file_path != null) {
        output.writeFieldBegin('file_path', thrift.Thrift.Type.STRING, 1);
        output.writeString(this.file_path);
        output.writeFieldEnd();
      }
      if (this.file_offset != null) {
        output.writeFieldBegin('file_offset', thrift.Thrift.Type.I64, 2);
        output.writeI64(this.file_offset);
        output.writeFieldEnd();
      }
      if (this.meta_data != null) {
        output.writeFieldBegin('meta_data', thrift.Thrift.Type.STRUCT, 3);
        this.meta_data.write(output);
        output.writeFieldEnd();
      }
      if (this.offset_index_offset != null) {
        output.writeFieldBegin('offset_index_offset', thrift.Thrift.Type.I64, 4);
        output.writeI64(this.offset_index_offset);
        output.writeFieldEnd();
      }
      if (this.offset_index_length != null) {
        output.writeFieldBegin('offset_index_length', thrift.Thrift.Type.I32, 5);
        output.writeI32(this.offset_index_length);
        output.writeFieldEnd();
      }
      if (this.column_index_offset != null) {
        output.writeFieldBegin('column_index_offset', thrift.Thrift.Type.I64, 6);
        output.writeI64(this.column_index_offset);
        output.writeFieldEnd();
      }
      if (this.column_index_length != null) {
        output.writeFieldBegin('column_index_length', thrift.Thrift.Type.I32, 7);
        output.writeI32(this.column_index_length);
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
            if (fieldType === thrift.Thrift.Type.STRING) {
              var value_1 = input.readString();
              _args.file_path = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_2 = input.readI64();
              _args.file_offset = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_3 = ColumnMetaData.ColumnMetaData.read(input);
              _args.meta_data = value_3;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_4 = input.readI64();
              _args.offset_index_offset = value_4;
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_5 = input.readI32();
              _args.offset_index_length = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 6:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_6 = input.readI64();
              _args.column_index_offset = value_6;
            } else {
              input.skip(fieldType);
            }
            break;
          case 7:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_7 = input.readI32();
              _args.column_index_length = value_7;
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
      if (_args.file_offset !== undefined) {
        return new ColumnChunk(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read ColumnChunk from input');
      }
    }
  }]);
  return ColumnChunk;
}();
exports.ColumnChunk = ColumnChunk;
//# sourceMappingURL=ColumnChunk.js.map