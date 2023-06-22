"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataPageHeaderV2 = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var Statistics = _interopRequireWildcard(require("./Statistics"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var DataPageHeaderV2 = function () {
  function DataPageHeaderV2(args) {
    (0, _classCallCheck2.default)(this, DataPageHeaderV2);
    (0, _defineProperty2.default)(this, "num_values", void 0);
    (0, _defineProperty2.default)(this, "num_nulls", void 0);
    (0, _defineProperty2.default)(this, "num_rows", void 0);
    (0, _defineProperty2.default)(this, "encoding", void 0);
    (0, _defineProperty2.default)(this, "definition_levels_byte_length", void 0);
    (0, _defineProperty2.default)(this, "repetition_levels_byte_length", void 0);
    (0, _defineProperty2.default)(this, "is_compressed", true);
    (0, _defineProperty2.default)(this, "statistics", void 0);
    if (args != null && args.num_values != null) {
      this.num_values = args.num_values;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_values] is unset!');
    }
    if (args != null && args.num_nulls != null) {
      this.num_nulls = args.num_nulls;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_nulls] is unset!');
    }
    if (args != null && args.num_rows != null) {
      this.num_rows = args.num_rows;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_rows] is unset!');
    }
    if (args != null && args.encoding != null) {
      this.encoding = args.encoding;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[encoding] is unset!');
    }
    if (args != null && args.definition_levels_byte_length != null) {
      this.definition_levels_byte_length = args.definition_levels_byte_length;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[definition_levels_byte_length] is unset!');
    }
    if (args != null && args.repetition_levels_byte_length != null) {
      this.repetition_levels_byte_length = args.repetition_levels_byte_length;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[repetition_levels_byte_length] is unset!');
    }
    if (args != null && args.is_compressed != null) {
      this.is_compressed = args.is_compressed;
    }
    if (args != null && args.statistics != null) {
      this.statistics = args.statistics;
    }
  }
  (0, _createClass2.default)(DataPageHeaderV2, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('DataPageHeaderV2');
      if (this.num_values != null) {
        output.writeFieldBegin('num_values', thrift.Thrift.Type.I32, 1);
        output.writeI32(this.num_values);
        output.writeFieldEnd();
      }
      if (this.num_nulls != null) {
        output.writeFieldBegin('num_nulls', thrift.Thrift.Type.I32, 2);
        output.writeI32(this.num_nulls);
        output.writeFieldEnd();
      }
      if (this.num_rows != null) {
        output.writeFieldBegin('num_rows', thrift.Thrift.Type.I32, 3);
        output.writeI32(this.num_rows);
        output.writeFieldEnd();
      }
      if (this.encoding != null) {
        output.writeFieldBegin('encoding', thrift.Thrift.Type.I32, 4);
        output.writeI32(this.encoding);
        output.writeFieldEnd();
      }
      if (this.definition_levels_byte_length != null) {
        output.writeFieldBegin('definition_levels_byte_length', thrift.Thrift.Type.I32, 5);
        output.writeI32(this.definition_levels_byte_length);
        output.writeFieldEnd();
      }
      if (this.repetition_levels_byte_length != null) {
        output.writeFieldBegin('repetition_levels_byte_length', thrift.Thrift.Type.I32, 6);
        output.writeI32(this.repetition_levels_byte_length);
        output.writeFieldEnd();
      }
      if (this.is_compressed != null) {
        output.writeFieldBegin('is_compressed', thrift.Thrift.Type.BOOL, 7);
        output.writeBool(this.is_compressed);
        output.writeFieldEnd();
      }
      if (this.statistics != null) {
        output.writeFieldBegin('statistics', thrift.Thrift.Type.STRUCT, 8);
        this.statistics.write(output);
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
              _args.num_values = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_2 = input.readI32();
              _args.num_nulls = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_3 = input.readI32();
              _args.num_rows = value_3;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_4 = input.readI32();
              _args.encoding = value_4;
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_5 = input.readI32();
              _args.definition_levels_byte_length = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 6:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_6 = input.readI32();
              _args.repetition_levels_byte_length = value_6;
            } else {
              input.skip(fieldType);
            }
            break;
          case 7:
            if (fieldType === thrift.Thrift.Type.BOOL) {
              var value_7 = input.readBool();
              _args.is_compressed = value_7;
            } else {
              input.skip(fieldType);
            }
            break;
          case 8:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_8 = Statistics.Statistics.read(input);
              _args.statistics = value_8;
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
      if (_args.num_values !== undefined && _args.num_nulls !== undefined && _args.num_rows !== undefined && _args.encoding !== undefined && _args.definition_levels_byte_length !== undefined && _args.repetition_levels_byte_length !== undefined) {
        return new DataPageHeaderV2(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read DataPageHeaderV2 from input');
      }
    }
  }]);
  return DataPageHeaderV2;
}();
exports.DataPageHeaderV2 = DataPageHeaderV2;
//# sourceMappingURL=DataPageHeaderV2.js.map