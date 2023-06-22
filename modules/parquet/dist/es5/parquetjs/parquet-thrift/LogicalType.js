"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogicalType = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var BsonType = _interopRequireWildcard(require("./BsonType"));
var DateType = _interopRequireWildcard(require("./DateType"));
var DecimalType = _interopRequireWildcard(require("./DecimalType"));
var EnumType = _interopRequireWildcard(require("./EnumType"));
var IntType = _interopRequireWildcard(require("./IntType"));
var JsonType = _interopRequireWildcard(require("./JsonType"));
var ListType = _interopRequireWildcard(require("./ListType"));
var MapType = _interopRequireWildcard(require("./MapType"));
var NullType = _interopRequireWildcard(require("./NullType"));
var StringType = _interopRequireWildcard(require("./StringType"));
var TimestampType = _interopRequireWildcard(require("./TimestampType"));
var TimeType = _interopRequireWildcard(require("./TimeType"));
var UUIDType = _interopRequireWildcard(require("./UUIDType"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var LogicalType = function () {
  function LogicalType(args) {
    (0, _classCallCheck2.default)(this, LogicalType);
    (0, _defineProperty2.default)(this, "STRING", void 0);
    (0, _defineProperty2.default)(this, "MAP", void 0);
    (0, _defineProperty2.default)(this, "LIST", void 0);
    (0, _defineProperty2.default)(this, "ENUM", void 0);
    (0, _defineProperty2.default)(this, "DECIMAL", void 0);
    (0, _defineProperty2.default)(this, "DATE", void 0);
    (0, _defineProperty2.default)(this, "TIME", void 0);
    (0, _defineProperty2.default)(this, "TIMESTAMP", void 0);
    (0, _defineProperty2.default)(this, "INTEGER", void 0);
    (0, _defineProperty2.default)(this, "UNKNOWN", void 0);
    (0, _defineProperty2.default)(this, "JSON", void 0);
    (0, _defineProperty2.default)(this, "BSON", void 0);
    (0, _defineProperty2.default)(this, "UUID", void 0);
    var _fieldsSet = 0;
    if (args != null) {
      if (args.STRING != null) {
        _fieldsSet++;
        this.STRING = args.STRING;
      }
      if (args.MAP != null) {
        _fieldsSet++;
        this.MAP = args.MAP;
      }
      if (args.LIST != null) {
        _fieldsSet++;
        this.LIST = args.LIST;
      }
      if (args.ENUM != null) {
        _fieldsSet++;
        this.ENUM = args.ENUM;
      }
      if (args.DECIMAL != null) {
        _fieldsSet++;
        this.DECIMAL = args.DECIMAL;
      }
      if (args.DATE != null) {
        _fieldsSet++;
        this.DATE = args.DATE;
      }
      if (args.TIME != null) {
        _fieldsSet++;
        this.TIME = args.TIME;
      }
      if (args.TIMESTAMP != null) {
        _fieldsSet++;
        this.TIMESTAMP = args.TIMESTAMP;
      }
      if (args.INTEGER != null) {
        _fieldsSet++;
        this.INTEGER = args.INTEGER;
      }
      if (args.UNKNOWN != null) {
        _fieldsSet++;
        this.UNKNOWN = args.UNKNOWN;
      }
      if (args.JSON != null) {
        _fieldsSet++;
        this.JSON = args.JSON;
      }
      if (args.BSON != null) {
        _fieldsSet++;
        this.BSON = args.BSON;
      }
      if (args.UUID != null) {
        _fieldsSet++;
        this.UUID = args.UUID;
      }
      if (_fieldsSet > 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
      } else if (_fieldsSet < 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
      }
    }
  }
  (0, _createClass2.default)(LogicalType, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('LogicalType');
      if (this.STRING != null) {
        output.writeFieldBegin('STRING', thrift.Thrift.Type.STRUCT, 1);
        this.STRING.write(output);
        output.writeFieldEnd();
      }
      if (this.MAP != null) {
        output.writeFieldBegin('MAP', thrift.Thrift.Type.STRUCT, 2);
        this.MAP.write(output);
        output.writeFieldEnd();
      }
      if (this.LIST != null) {
        output.writeFieldBegin('LIST', thrift.Thrift.Type.STRUCT, 3);
        this.LIST.write(output);
        output.writeFieldEnd();
      }
      if (this.ENUM != null) {
        output.writeFieldBegin('ENUM', thrift.Thrift.Type.STRUCT, 4);
        this.ENUM.write(output);
        output.writeFieldEnd();
      }
      if (this.DECIMAL != null) {
        output.writeFieldBegin('DECIMAL', thrift.Thrift.Type.STRUCT, 5);
        this.DECIMAL.write(output);
        output.writeFieldEnd();
      }
      if (this.DATE != null) {
        output.writeFieldBegin('DATE', thrift.Thrift.Type.STRUCT, 6);
        this.DATE.write(output);
        output.writeFieldEnd();
      }
      if (this.TIME != null) {
        output.writeFieldBegin('TIME', thrift.Thrift.Type.STRUCT, 7);
        this.TIME.write(output);
        output.writeFieldEnd();
      }
      if (this.TIMESTAMP != null) {
        output.writeFieldBegin('TIMESTAMP', thrift.Thrift.Type.STRUCT, 8);
        this.TIMESTAMP.write(output);
        output.writeFieldEnd();
      }
      if (this.INTEGER != null) {
        output.writeFieldBegin('INTEGER', thrift.Thrift.Type.STRUCT, 10);
        this.INTEGER.write(output);
        output.writeFieldEnd();
      }
      if (this.UNKNOWN != null) {
        output.writeFieldBegin('UNKNOWN', thrift.Thrift.Type.STRUCT, 11);
        this.UNKNOWN.write(output);
        output.writeFieldEnd();
      }
      if (this.JSON != null) {
        output.writeFieldBegin('JSON', thrift.Thrift.Type.STRUCT, 12);
        this.JSON.write(output);
        output.writeFieldEnd();
      }
      if (this.BSON != null) {
        output.writeFieldBegin('BSON', thrift.Thrift.Type.STRUCT, 13);
        this.BSON.write(output);
        output.writeFieldEnd();
      }
      if (this.UUID != null) {
        output.writeFieldBegin('UUID', thrift.Thrift.Type.STRUCT, 14);
        this.UUID.write(output);
        output.writeFieldEnd();
      }
      output.writeFieldStop();
      output.writeStructEnd();
      return;
    }
  }], [{
    key: "fromSTRING",
    value: function fromSTRING(STRING) {
      return new LogicalType({
        STRING: STRING
      });
    }
  }, {
    key: "fromMAP",
    value: function fromMAP(MAP) {
      return new LogicalType({
        MAP: MAP
      });
    }
  }, {
    key: "fromLIST",
    value: function fromLIST(LIST) {
      return new LogicalType({
        LIST: LIST
      });
    }
  }, {
    key: "fromENUM",
    value: function fromENUM(ENUM) {
      return new LogicalType({
        ENUM: ENUM
      });
    }
  }, {
    key: "fromDECIMAL",
    value: function fromDECIMAL(DECIMAL) {
      return new LogicalType({
        DECIMAL: DECIMAL
      });
    }
  }, {
    key: "fromDATE",
    value: function fromDATE(DATE) {
      return new LogicalType({
        DATE: DATE
      });
    }
  }, {
    key: "fromTIME",
    value: function fromTIME(TIME) {
      return new LogicalType({
        TIME: TIME
      });
    }
  }, {
    key: "fromTIMESTAMP",
    value: function fromTIMESTAMP(TIMESTAMP) {
      return new LogicalType({
        TIMESTAMP: TIMESTAMP
      });
    }
  }, {
    key: "fromINTEGER",
    value: function fromINTEGER(INTEGER) {
      return new LogicalType({
        INTEGER: INTEGER
      });
    }
  }, {
    key: "fromUNKNOWN",
    value: function fromUNKNOWN(UNKNOWN) {
      return new LogicalType({
        UNKNOWN: UNKNOWN
      });
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(JSON) {
      return new LogicalType({
        JSON: JSON
      });
    }
  }, {
    key: "fromBSON",
    value: function fromBSON(BSON) {
      return new LogicalType({
        BSON: BSON
      });
    }
  }, {
    key: "fromUUID",
    value: function fromUUID(UUID) {
      return new LogicalType({
        UUID: UUID
      });
    }
  }, {
    key: "read",
    value: function read(input) {
      var _fieldsSet = 0;
      var _returnValue = null;
      input.readStructBegin();
      while (true) {
        var ret = input.readFieldBegin();
        var fieldType = ret.ftype;
        var fieldId = ret.fid;
        if (fieldType === thrift.Thrift.Type.STOP) {
          break;
        }
        switch (fieldId) {
          case 1:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_1 = StringType.StringType.read(input);
              _returnValue = LogicalType.fromSTRING(value_1);
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_2 = MapType.MapType.read(input);
              _returnValue = LogicalType.fromMAP(value_2);
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_3 = ListType.ListType.read(input);
              _returnValue = LogicalType.fromLIST(value_3);
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_4 = EnumType.EnumType.read(input);
              _returnValue = LogicalType.fromENUM(value_4);
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_5 = DecimalType.DecimalType.read(input);
              _returnValue = LogicalType.fromDECIMAL(value_5);
            } else {
              input.skip(fieldType);
            }
            break;
          case 6:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_6 = DateType.DateType.read(input);
              _returnValue = LogicalType.fromDATE(value_6);
            } else {
              input.skip(fieldType);
            }
            break;
          case 7:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_7 = TimeType.TimeType.read(input);
              _returnValue = LogicalType.fromTIME(value_7);
            } else {
              input.skip(fieldType);
            }
            break;
          case 8:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_8 = TimestampType.TimestampType.read(input);
              _returnValue = LogicalType.fromTIMESTAMP(value_8);
            } else {
              input.skip(fieldType);
            }
            break;
          case 10:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_9 = IntType.IntType.read(input);
              _returnValue = LogicalType.fromINTEGER(value_9);
            } else {
              input.skip(fieldType);
            }
            break;
          case 11:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_10 = NullType.NullType.read(input);
              _returnValue = LogicalType.fromUNKNOWN(value_10);
            } else {
              input.skip(fieldType);
            }
            break;
          case 12:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_11 = JsonType.JsonType.read(input);
              _returnValue = LogicalType.fromJSON(value_11);
            } else {
              input.skip(fieldType);
            }
            break;
          case 13:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_12 = BsonType.BsonType.read(input);
              _returnValue = LogicalType.fromBSON(value_12);
            } else {
              input.skip(fieldType);
            }
            break;
          case 14:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_13 = UUIDType.UUIDType.read(input);
              _returnValue = LogicalType.fromUUID(value_13);
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
      if (_fieldsSet > 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
      } else if (_fieldsSet < 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
      }
      if (_returnValue !== null) {
        return _returnValue;
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read data for TUnion');
      }
    }
  }]);
  return LogicalType;
}();
exports.LogicalType = LogicalType;
//# sourceMappingURL=LogicalType.js.map