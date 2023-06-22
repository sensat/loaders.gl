import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
export class DictionaryPageHeader {
  constructor(args) {
    _defineProperty(this, "num_values", void 0);
    _defineProperty(this, "encoding", void 0);
    _defineProperty(this, "is_sorted", void 0);
    if (args != null && args.num_values != null) {
      this.num_values = args.num_values;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_values] is unset!');
    }
    if (args != null && args.encoding != null) {
      this.encoding = args.encoding;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[encoding] is unset!');
    }
    if (args != null && args.is_sorted != null) {
      this.is_sorted = args.is_sorted;
    }
  }
  write(output) {
    output.writeStructBegin('DictionaryPageHeader');
    if (this.num_values != null) {
      output.writeFieldBegin('num_values', thrift.Thrift.Type.I32, 1);
      output.writeI32(this.num_values);
      output.writeFieldEnd();
    }
    if (this.encoding != null) {
      output.writeFieldBegin('encoding', thrift.Thrift.Type.I32, 2);
      output.writeI32(this.encoding);
      output.writeFieldEnd();
    }
    if (this.is_sorted != null) {
      output.writeFieldBegin('is_sorted', thrift.Thrift.Type.BOOL, 3);
      output.writeBool(this.is_sorted);
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
            _args.num_values = value_1;
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
          if (fieldType === thrift.Thrift.Type.BOOL) {
            const value_3 = input.readBool();
            _args.is_sorted = value_3;
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
    if (_args.num_values !== undefined && _args.encoding !== undefined) {
      return new DictionaryPageHeader(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read DictionaryPageHeader from input');
    }
  }
}
//# sourceMappingURL=DictionaryPageHeader.js.map