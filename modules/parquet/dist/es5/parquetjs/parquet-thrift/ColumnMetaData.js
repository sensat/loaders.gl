"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnMetaData = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _nodeInt = _interopRequireDefault(require("node-int64"));
var thrift = _interopRequireWildcard(require("thrift"));
var KeyValue = _interopRequireWildcard(require("./KeyValue"));
var PageEncodingStats = _interopRequireWildcard(require("./PageEncodingStats"));
var Statistics = _interopRequireWildcard(require("./Statistics"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var ColumnMetaData = function () {
  function ColumnMetaData(args) {
    (0, _classCallCheck2.default)(this, ColumnMetaData);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "encodings", void 0);
    (0, _defineProperty2.default)(this, "path_in_schema", void 0);
    (0, _defineProperty2.default)(this, "codec", void 0);
    (0, _defineProperty2.default)(this, "num_values", void 0);
    (0, _defineProperty2.default)(this, "total_uncompressed_size", void 0);
    (0, _defineProperty2.default)(this, "total_compressed_size", void 0);
    (0, _defineProperty2.default)(this, "key_value_metadata", void 0);
    (0, _defineProperty2.default)(this, "data_page_offset", void 0);
    (0, _defineProperty2.default)(this, "index_page_offset", void 0);
    (0, _defineProperty2.default)(this, "dictionary_page_offset", void 0);
    (0, _defineProperty2.default)(this, "statistics", void 0);
    (0, _defineProperty2.default)(this, "encoding_stats", void 0);
    if (args != null && args.type != null) {
      this.type = args.type;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[type] is unset!');
    }
    if (args != null && args.encodings != null) {
      this.encodings = args.encodings;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[encodings] is unset!');
    }
    if (args != null && args.path_in_schema != null) {
      this.path_in_schema = args.path_in_schema;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[path_in_schema] is unset!');
    }
    if (args != null && args.codec != null) {
      this.codec = args.codec;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[codec] is unset!');
    }
    if (args != null && args.num_values != null) {
      if (typeof args.num_values === 'number') {
        this.num_values = new _nodeInt.default(args.num_values);
      } else {
        this.num_values = args.num_values;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_values] is unset!');
    }
    if (args != null && args.total_uncompressed_size != null) {
      if (typeof args.total_uncompressed_size === 'number') {
        this.total_uncompressed_size = new _nodeInt.default(args.total_uncompressed_size);
      } else {
        this.total_uncompressed_size = args.total_uncompressed_size;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[total_uncompressed_size] is unset!');
    }
    if (args != null && args.total_compressed_size != null) {
      if (typeof args.total_compressed_size === 'number') {
        this.total_compressed_size = new _nodeInt.default(args.total_compressed_size);
      } else {
        this.total_compressed_size = args.total_compressed_size;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[total_compressed_size] is unset!');
    }
    if (args != null && args.key_value_metadata != null) {
      this.key_value_metadata = args.key_value_metadata;
    }
    if (args != null && args.data_page_offset != null) {
      if (typeof args.data_page_offset === 'number') {
        this.data_page_offset = new _nodeInt.default(args.data_page_offset);
      } else {
        this.data_page_offset = args.data_page_offset;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[data_page_offset] is unset!');
    }
    if (args != null && args.index_page_offset != null) {
      if (typeof args.index_page_offset === 'number') {
        this.index_page_offset = new _nodeInt.default(args.index_page_offset);
      } else {
        this.index_page_offset = args.index_page_offset;
      }
    }
    if (args != null && args.dictionary_page_offset != null) {
      if (typeof args.dictionary_page_offset === 'number') {
        this.dictionary_page_offset = new _nodeInt.default(args.dictionary_page_offset);
      } else {
        this.dictionary_page_offset = args.dictionary_page_offset;
      }
    }
    if (args != null && args.statistics != null) {
      this.statistics = args.statistics;
    }
    if (args != null && args.encoding_stats != null) {
      this.encoding_stats = args.encoding_stats;
    }
  }
  (0, _createClass2.default)(ColumnMetaData, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('ColumnMetaData');
      if (this.type != null) {
        output.writeFieldBegin('type', thrift.Thrift.Type.I32, 1);
        output.writeI32(this.type);
        output.writeFieldEnd();
      }
      if (this.encodings != null) {
        output.writeFieldBegin('encodings', thrift.Thrift.Type.LIST, 2);
        output.writeListBegin(thrift.Thrift.Type.I32, this.encodings.length);
        this.encodings.forEach(function (value_1) {
          output.writeI32(value_1);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      if (this.path_in_schema != null) {
        output.writeFieldBegin('path_in_schema', thrift.Thrift.Type.LIST, 3);
        output.writeListBegin(thrift.Thrift.Type.STRING, this.path_in_schema.length);
        this.path_in_schema.forEach(function (value_2) {
          output.writeString(value_2);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      if (this.codec != null) {
        output.writeFieldBegin('codec', thrift.Thrift.Type.I32, 4);
        output.writeI32(this.codec);
        output.writeFieldEnd();
      }
      if (this.num_values != null) {
        output.writeFieldBegin('num_values', thrift.Thrift.Type.I64, 5);
        output.writeI64(this.num_values);
        output.writeFieldEnd();
      }
      if (this.total_uncompressed_size != null) {
        output.writeFieldBegin('total_uncompressed_size', thrift.Thrift.Type.I64, 6);
        output.writeI64(this.total_uncompressed_size);
        output.writeFieldEnd();
      }
      if (this.total_compressed_size != null) {
        output.writeFieldBegin('total_compressed_size', thrift.Thrift.Type.I64, 7);
        output.writeI64(this.total_compressed_size);
        output.writeFieldEnd();
      }
      if (this.key_value_metadata != null) {
        output.writeFieldBegin('key_value_metadata', thrift.Thrift.Type.LIST, 8);
        output.writeListBegin(thrift.Thrift.Type.STRUCT, this.key_value_metadata.length);
        this.key_value_metadata.forEach(function (value_3) {
          value_3.write(output);
        });
        output.writeListEnd();
        output.writeFieldEnd();
      }
      if (this.data_page_offset != null) {
        output.writeFieldBegin('data_page_offset', thrift.Thrift.Type.I64, 9);
        output.writeI64(this.data_page_offset);
        output.writeFieldEnd();
      }
      if (this.index_page_offset != null) {
        output.writeFieldBegin('index_page_offset', thrift.Thrift.Type.I64, 10);
        output.writeI64(this.index_page_offset);
        output.writeFieldEnd();
      }
      if (this.dictionary_page_offset != null) {
        output.writeFieldBegin('dictionary_page_offset', thrift.Thrift.Type.I64, 11);
        output.writeI64(this.dictionary_page_offset);
        output.writeFieldEnd();
      }
      if (this.statistics != null) {
        output.writeFieldBegin('statistics', thrift.Thrift.Type.STRUCT, 12);
        this.statistics.write(output);
        output.writeFieldEnd();
      }
      if (this.encoding_stats != null) {
        output.writeFieldBegin('encoding_stats', thrift.Thrift.Type.LIST, 13);
        output.writeListBegin(thrift.Thrift.Type.STRUCT, this.encoding_stats.length);
        this.encoding_stats.forEach(function (value_4) {
          value_4.write(output);
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
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_5 = input.readI32();
              _args.type = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_6 = new Array();
              var metadata_1 = input.readListBegin();
              var size_1 = metadata_1.size;
              for (var i_1 = 0; i_1 < size_1; i_1++) {
                var value_7 = input.readI32();
                value_6.push(value_7);
              }
              input.readListEnd();
              _args.encodings = value_6;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_8 = new Array();
              var metadata_2 = input.readListBegin();
              var size_2 = metadata_2.size;
              for (var i_2 = 0; i_2 < size_2; i_2++) {
                var value_9 = input.readString();
                value_8.push(value_9);
              }
              input.readListEnd();
              _args.path_in_schema = value_8;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_10 = input.readI32();
              _args.codec = value_10;
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_11 = input.readI64();
              _args.num_values = value_11;
            } else {
              input.skip(fieldType);
            }
            break;
          case 6:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_12 = input.readI64();
              _args.total_uncompressed_size = value_12;
            } else {
              input.skip(fieldType);
            }
            break;
          case 7:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_13 = input.readI64();
              _args.total_compressed_size = value_13;
            } else {
              input.skip(fieldType);
            }
            break;
          case 8:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_14 = new Array();
              var metadata_3 = input.readListBegin();
              var size_3 = metadata_3.size;
              for (var i_3 = 0; i_3 < size_3; i_3++) {
                var value_15 = KeyValue.KeyValue.read(input);
                value_14.push(value_15);
              }
              input.readListEnd();
              _args.key_value_metadata = value_14;
            } else {
              input.skip(fieldType);
            }
            break;
          case 9:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_16 = input.readI64();
              _args.data_page_offset = value_16;
            } else {
              input.skip(fieldType);
            }
            break;
          case 10:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_17 = input.readI64();
              _args.index_page_offset = value_17;
            } else {
              input.skip(fieldType);
            }
            break;
          case 11:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_18 = input.readI64();
              _args.dictionary_page_offset = value_18;
            } else {
              input.skip(fieldType);
            }
            break;
          case 12:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_19 = Statistics.Statistics.read(input);
              _args.statistics = value_19;
            } else {
              input.skip(fieldType);
            }
            break;
          case 13:
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_20 = new Array();
              var metadata_4 = input.readListBegin();
              var size_4 = metadata_4.size;
              for (var i_4 = 0; i_4 < size_4; i_4++) {
                var value_21 = PageEncodingStats.PageEncodingStats.read(input);
                value_20.push(value_21);
              }
              input.readListEnd();
              _args.encoding_stats = value_20;
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
      if (_args.type !== undefined && _args.encodings !== undefined && _args.path_in_schema !== undefined && _args.codec !== undefined && _args.num_values !== undefined && _args.total_uncompressed_size !== undefined && _args.total_compressed_size !== undefined && _args.data_page_offset !== undefined) {
        return new ColumnMetaData(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read ColumnMetaData from input');
      }
    }
  }]);
  return ColumnMetaData;
}();
exports.ColumnMetaData = ColumnMetaData;
//# sourceMappingURL=ColumnMetaData.js.map