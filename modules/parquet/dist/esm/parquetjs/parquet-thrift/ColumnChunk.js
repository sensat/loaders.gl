import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as ColumnMetaData from './ColumnMetaData';
export class ColumnChunk {
  constructor(args) {
    _defineProperty(this, "file_path", void 0);
    _defineProperty(this, "file_offset", void 0);
    _defineProperty(this, "meta_data", void 0);
    _defineProperty(this, "offset_index_offset", void 0);
    _defineProperty(this, "offset_index_length", void 0);
    _defineProperty(this, "column_index_offset", void 0);
    _defineProperty(this, "column_index_length", void 0);
    if (args != null && args.file_path != null) {
      this.file_path = args.file_path;
    }
    if (args != null && args.file_offset != null) {
      if (typeof args.file_offset === 'number') {
        this.file_offset = new Int64(args.file_offset);
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
        this.offset_index_offset = new Int64(args.offset_index_offset);
      } else {
        this.offset_index_offset = args.offset_index_offset;
      }
    }
    if (args != null && args.offset_index_length != null) {
      this.offset_index_length = args.offset_index_length;
    }
    if (args != null && args.column_index_offset != null) {
      if (typeof args.column_index_offset === 'number') {
        this.column_index_offset = new Int64(args.column_index_offset);
      } else {
        this.column_index_offset = args.column_index_offset;
      }
    }
    if (args != null && args.column_index_length != null) {
      this.column_index_length = args.column_index_length;
    }
  }
  write(output) {
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
          if (fieldType === thrift.Thrift.Type.STRING) {
            const value_1 = input.readString();
            _args.file_path = value_1;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_2 = input.readI64();
            _args.file_offset = value_2;
          } else {
            input.skip(fieldType);
          }
          break;
        case 3:
          if (fieldType === thrift.Thrift.Type.STRUCT) {
            const value_3 = ColumnMetaData.ColumnMetaData.read(input);
            _args.meta_data = value_3;
          } else {
            input.skip(fieldType);
          }
          break;
        case 4:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_4 = input.readI64();
            _args.offset_index_offset = value_4;
          } else {
            input.skip(fieldType);
          }
          break;
        case 5:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_5 = input.readI32();
            _args.offset_index_length = value_5;
          } else {
            input.skip(fieldType);
          }
          break;
        case 6:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_6 = input.readI64();
            _args.column_index_offset = value_6;
          } else {
            input.skip(fieldType);
          }
          break;
        case 7:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_7 = input.readI32();
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
}
//# sourceMappingURL=ColumnChunk.js.map