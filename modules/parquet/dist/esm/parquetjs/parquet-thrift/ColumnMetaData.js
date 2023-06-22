import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as KeyValue from './KeyValue';
import * as PageEncodingStats from './PageEncodingStats';
import * as Statistics from './Statistics';
export class ColumnMetaData {
  constructor(args) {
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "encodings", void 0);
    _defineProperty(this, "path_in_schema", void 0);
    _defineProperty(this, "codec", void 0);
    _defineProperty(this, "num_values", void 0);
    _defineProperty(this, "total_uncompressed_size", void 0);
    _defineProperty(this, "total_compressed_size", void 0);
    _defineProperty(this, "key_value_metadata", void 0);
    _defineProperty(this, "data_page_offset", void 0);
    _defineProperty(this, "index_page_offset", void 0);
    _defineProperty(this, "dictionary_page_offset", void 0);
    _defineProperty(this, "statistics", void 0);
    _defineProperty(this, "encoding_stats", void 0);
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
        this.num_values = new Int64(args.num_values);
      } else {
        this.num_values = args.num_values;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_values] is unset!');
    }
    if (args != null && args.total_uncompressed_size != null) {
      if (typeof args.total_uncompressed_size === 'number') {
        this.total_uncompressed_size = new Int64(args.total_uncompressed_size);
      } else {
        this.total_uncompressed_size = args.total_uncompressed_size;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[total_uncompressed_size] is unset!');
    }
    if (args != null && args.total_compressed_size != null) {
      if (typeof args.total_compressed_size === 'number') {
        this.total_compressed_size = new Int64(args.total_compressed_size);
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
        this.data_page_offset = new Int64(args.data_page_offset);
      } else {
        this.data_page_offset = args.data_page_offset;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[data_page_offset] is unset!');
    }
    if (args != null && args.index_page_offset != null) {
      if (typeof args.index_page_offset === 'number') {
        this.index_page_offset = new Int64(args.index_page_offset);
      } else {
        this.index_page_offset = args.index_page_offset;
      }
    }
    if (args != null && args.dictionary_page_offset != null) {
      if (typeof args.dictionary_page_offset === 'number') {
        this.dictionary_page_offset = new Int64(args.dictionary_page_offset);
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
  write(output) {
    output.writeStructBegin('ColumnMetaData');
    if (this.type != null) {
      output.writeFieldBegin('type', thrift.Thrift.Type.I32, 1);
      output.writeI32(this.type);
      output.writeFieldEnd();
    }
    if (this.encodings != null) {
      output.writeFieldBegin('encodings', thrift.Thrift.Type.LIST, 2);
      output.writeListBegin(thrift.Thrift.Type.I32, this.encodings.length);
      this.encodings.forEach(value_1 => {
        output.writeI32(value_1);
      });
      output.writeListEnd();
      output.writeFieldEnd();
    }
    if (this.path_in_schema != null) {
      output.writeFieldBegin('path_in_schema', thrift.Thrift.Type.LIST, 3);
      output.writeListBegin(thrift.Thrift.Type.STRING, this.path_in_schema.length);
      this.path_in_schema.forEach(value_2 => {
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
      this.key_value_metadata.forEach(value_3 => {
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
      this.encoding_stats.forEach(value_4 => {
        value_4.write(output);
      });
      output.writeListEnd();
      output.writeFieldEnd();
    }
    output.writeFieldStop();
    output.writeStructEnd();
    return;
  }
  static read(input) {
    input.readStructBegin();
    let _args = {};
    while (true) {
      const ret = input.readFieldBegin();
      const fieldType = ret.ftype;
      const fieldId = ret.fid;
      if (fieldType === thrift.Thrift.Type.STOP) {
        break;
      }
      switch (fieldId) {
        case 1:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_5 = input.readI32();
            _args.type = value_5;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_6 = new Array();
            const metadata_1 = input.readListBegin();
            const size_1 = metadata_1.size;
            for (let i_1 = 0; i_1 < size_1; i_1++) {
              const value_7 = input.readI32();
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
            const value_8 = new Array();
            const metadata_2 = input.readListBegin();
            const size_2 = metadata_2.size;
            for (let i_2 = 0; i_2 < size_2; i_2++) {
              const value_9 = input.readString();
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
            const value_10 = input.readI32();
            _args.codec = value_10;
          } else {
            input.skip(fieldType);
          }
          break;
        case 5:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_11 = input.readI64();
            _args.num_values = value_11;
          } else {
            input.skip(fieldType);
          }
          break;
        case 6:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_12 = input.readI64();
            _args.total_uncompressed_size = value_12;
          } else {
            input.skip(fieldType);
          }
          break;
        case 7:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_13 = input.readI64();
            _args.total_compressed_size = value_13;
          } else {
            input.skip(fieldType);
          }
          break;
        case 8:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_14 = new Array();
            const metadata_3 = input.readListBegin();
            const size_3 = metadata_3.size;
            for (let i_3 = 0; i_3 < size_3; i_3++) {
              const value_15 = KeyValue.KeyValue.read(input);
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
            const value_16 = input.readI64();
            _args.data_page_offset = value_16;
          } else {
            input.skip(fieldType);
          }
          break;
        case 10:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_17 = input.readI64();
            _args.index_page_offset = value_17;
          } else {
            input.skip(fieldType);
          }
          break;
        case 11:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_18 = input.readI64();
            _args.dictionary_page_offset = value_18;
          } else {
            input.skip(fieldType);
          }
          break;
        case 12:
          if (fieldType === thrift.Thrift.Type.STRUCT) {
            const value_19 = Statistics.Statistics.read(input);
            _args.statistics = value_19;
          } else {
            input.skip(fieldType);
          }
          break;
        case 13:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_20 = new Array();
            const metadata_4 = input.readListBegin();
            const size_4 = metadata_4.size;
            for (let i_4 = 0; i_4 < size_4; i_4++) {
              const value_21 = PageEncodingStats.PageEncodingStats.read(input);
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
}
//# sourceMappingURL=ColumnMetaData.js.map