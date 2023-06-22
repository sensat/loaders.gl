import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Int64 from 'node-int64';
import * as thrift from 'thrift';
export class PageLocation {
  constructor(args) {
    _defineProperty(this, "offset", void 0);
    _defineProperty(this, "compressed_page_size", void 0);
    _defineProperty(this, "first_row_index", void 0);
    if (args != null && args.offset != null) {
      if (typeof args.offset === 'number') {
        this.offset = new Int64(args.offset);
      } else {
        this.offset = args.offset;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[offset] is unset!');
    }
    if (args != null && args.compressed_page_size != null) {
      this.compressed_page_size = args.compressed_page_size;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[compressed_page_size] is unset!');
    }
    if (args != null && args.first_row_index != null) {
      if (typeof args.first_row_index === 'number') {
        this.first_row_index = new Int64(args.first_row_index);
      } else {
        this.first_row_index = args.first_row_index;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[first_row_index] is unset!');
    }
  }
  write(output) {
    output.writeStructBegin('PageLocation');
    if (this.offset != null) {
      output.writeFieldBegin('offset', thrift.Thrift.Type.I64, 1);
      output.writeI64(this.offset);
      output.writeFieldEnd();
    }
    if (this.compressed_page_size != null) {
      output.writeFieldBegin('compressed_page_size', thrift.Thrift.Type.I32, 2);
      output.writeI32(this.compressed_page_size);
      output.writeFieldEnd();
    }
    if (this.first_row_index != null) {
      output.writeFieldBegin('first_row_index', thrift.Thrift.Type.I64, 3);
      output.writeI64(this.first_row_index);
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
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_1 = input.readI64();
            _args.offset = value_1;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_2 = input.readI32();
            _args.compressed_page_size = value_2;
          } else {
            input.skip(fieldType);
          }
          break;
        case 3:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_3 = input.readI64();
            _args.first_row_index = value_3;
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
    if (_args.offset !== undefined && _args.compressed_page_size !== undefined && _args.first_row_index !== undefined) {
      return new PageLocation(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read PageLocation from input');
    }
  }
}
//# sourceMappingURL=PageLocation.js.map