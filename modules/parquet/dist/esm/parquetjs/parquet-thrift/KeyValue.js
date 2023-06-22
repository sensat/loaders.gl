import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
export class KeyValue {
  constructor(args) {
    _defineProperty(this, "key", void 0);
    _defineProperty(this, "value", void 0);
    if (args != null && args.key != null) {
      this.key = args.key;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[key] is unset!');
    }
    if (args != null && args.value != null) {
      this.value = args.value;
    }
  }
  write(output) {
    output.writeStructBegin('KeyValue');
    if (this.key != null) {
      output.writeFieldBegin('key', thrift.Thrift.Type.STRING, 1);
      output.writeString(this.key);
      output.writeFieldEnd();
    }
    if (this.value != null) {
      output.writeFieldBegin('value', thrift.Thrift.Type.STRING, 2);
      output.writeString(this.value);
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
            _args.key = value_1;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.STRING) {
            const value_2 = input.readString();
            _args.value = value_2;
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
    if (_args.key !== undefined) {
      return new KeyValue(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read KeyValue from input');
    }
  }
}
//# sourceMappingURL=KeyValue.js.map