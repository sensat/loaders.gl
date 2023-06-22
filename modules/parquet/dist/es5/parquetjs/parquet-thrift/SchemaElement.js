"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaElement = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var LogicalType = _interopRequireWildcard(require("./LogicalType"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var SchemaElement = function () {
  function SchemaElement(args) {
    (0, _classCallCheck2.default)(this, SchemaElement);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "type_length", void 0);
    (0, _defineProperty2.default)(this, "repetition_type", void 0);
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "num_children", void 0);
    (0, _defineProperty2.default)(this, "converted_type", void 0);
    (0, _defineProperty2.default)(this, "scale", void 0);
    (0, _defineProperty2.default)(this, "precision", void 0);
    (0, _defineProperty2.default)(this, "field_id", void 0);
    (0, _defineProperty2.default)(this, "logicalType", void 0);
    if (args != null && args.type != null) {
      this.type = args.type;
    }
    if (args != null && args.type_length != null) {
      this.type_length = args.type_length;
    }
    if (args != null && args.repetition_type != null) {
      this.repetition_type = args.repetition_type;
    }
    if (args != null && args.name != null) {
      this.name = args.name;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[name] is unset!');
    }
    if (args != null && args.num_children != null) {
      this.num_children = args.num_children;
    }
    if (args != null && args.converted_type != null) {
      this.converted_type = args.converted_type;
    }
    if (args != null && args.scale != null) {
      this.scale = args.scale;
    }
    if (args != null && args.precision != null) {
      this.precision = args.precision;
    }
    if (args != null && args.field_id != null) {
      this.field_id = args.field_id;
    }
    if (args != null && args.logicalType != null) {
      this.logicalType = args.logicalType;
    }
  }
  (0, _createClass2.default)(SchemaElement, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('SchemaElement');
      if (this.type != null) {
        output.writeFieldBegin('type', thrift.Thrift.Type.I32, 1);
        output.writeI32(this.type);
        output.writeFieldEnd();
      }
      if (this.type_length != null) {
        output.writeFieldBegin('type_length', thrift.Thrift.Type.I32, 2);
        output.writeI32(this.type_length);
        output.writeFieldEnd();
      }
      if (this.repetition_type != null) {
        output.writeFieldBegin('repetition_type', thrift.Thrift.Type.I32, 3);
        output.writeI32(this.repetition_type);
        output.writeFieldEnd();
      }
      if (this.name != null) {
        output.writeFieldBegin('name', thrift.Thrift.Type.STRING, 4);
        output.writeString(this.name);
        output.writeFieldEnd();
      }
      if (this.num_children != null) {
        output.writeFieldBegin('num_children', thrift.Thrift.Type.I32, 5);
        output.writeI32(this.num_children);
        output.writeFieldEnd();
      }
      if (this.converted_type != null) {
        output.writeFieldBegin('converted_type', thrift.Thrift.Type.I32, 6);
        output.writeI32(this.converted_type);
        output.writeFieldEnd();
      }
      if (this.scale != null) {
        output.writeFieldBegin('scale', thrift.Thrift.Type.I32, 7);
        output.writeI32(this.scale);
        output.writeFieldEnd();
      }
      if (this.precision != null) {
        output.writeFieldBegin('precision', thrift.Thrift.Type.I32, 8);
        output.writeI32(this.precision);
        output.writeFieldEnd();
      }
      if (this.field_id != null) {
        output.writeFieldBegin('field_id', thrift.Thrift.Type.I32, 9);
        output.writeI32(this.field_id);
        output.writeFieldEnd();
      }
      if (this.logicalType != null) {
        output.writeFieldBegin('logicalType', thrift.Thrift.Type.STRUCT, 10);
        this.logicalType.write(output);
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
              _args.type = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_2 = input.readI32();
              _args.type_length = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_3 = input.readI32();
              _args.repetition_type = value_3;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.STRING) {
              var value_4 = input.readString();
              _args.name = value_4;
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_5 = input.readI32();
              _args.num_children = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 6:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_6 = input.readI32();
              _args.converted_type = value_6;
            } else {
              input.skip(fieldType);
            }
            break;
          case 7:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_7 = input.readI32();
              _args.scale = value_7;
            } else {
              input.skip(fieldType);
            }
            break;
          case 8:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_8 = input.readI32();
              _args.precision = value_8;
            } else {
              input.skip(fieldType);
            }
            break;
          case 9:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_9 = input.readI32();
              _args.field_id = value_9;
            } else {
              input.skip(fieldType);
            }
            break;
          case 10:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_10 = LogicalType.LogicalType.read(input);
              _args.logicalType = value_10;
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
      if (_args.name !== undefined) {
        return new SchemaElement(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read SchemaElement from input');
      }
    }
  }]);
  return SchemaElement;
}();
exports.SchemaElement = SchemaElement;
//# sourceMappingURL=SchemaElement.js.map