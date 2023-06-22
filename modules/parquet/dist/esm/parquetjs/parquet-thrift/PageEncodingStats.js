import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
export class PageEncodingStats {
  constructor(args) {
    _defineProperty(this, "page_type", void 0);
    _defineProperty(this, "encoding", void 0);
    _defineProperty(this, "count", void 0);
    if (args != null && args.page_type != null) {
      this.page_type = args.page_type;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[page_type] is unset!');
    }
    if (args != null && args.encoding != null) {
      this.encoding = args.encoding;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[encoding] is unset!');
    }
    if (args != null && args.count != null) {
      this.count = args.count;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[count] is unset!');
    }
  }
  write(output) {
    output.writeStructBegin('PageEncodingStats');
    if (this.page_type != null) {
      output.writeFieldBegin('page_type', thrift.Thrift.Type.I32, 1);
      output.writeI32(this.page_type);
      output.writeFieldEnd();
    }
    if (this.encoding != null) {
      output.writeFieldBegin('encoding', thrift.Thrift.Type.I32, 2);
      output.writeI32(this.encoding);
      output.writeFieldEnd();
    }
    if (this.count != null) {
      output.writeFieldBegin('count', thrift.Thrift.Type.I32, 3);
      output.writeI32(this.count);
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
            const value_1 = input.readI32();
            _args.page_type = value_1;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_2 = input.readI32();
            _args.encoding = value_2;
          } else {
            input.skip(fieldType);
          }
          break;
        case 3:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_3 = input.readI32();
            _args.count = value_3;
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
    if (_args.page_type !== undefined && _args.encoding !== undefined && _args.count !== undefined) {
      return new PageEncodingStats(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read PageEncodingStats from input');
    }
  }
}
//# sourceMappingURL=PageEncodingStats.js.map