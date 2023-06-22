import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
export class DecimalType {
  constructor(args) {
    _defineProperty(this, "scale", void 0);
    _defineProperty(this, "precision", void 0);
    if (args != null && args.scale != null) {
      this.scale = args.scale;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[scale] is unset!');
    }
    if (args != null && args.precision != null) {
      this.precision = args.precision;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[precision] is unset!');
    }
  }
  write(output) {
    output.writeStructBegin('DecimalType');
    if (this.scale != null) {
      output.writeFieldBegin('scale', thrift.Thrift.Type.I32, 1);
      output.writeI32(this.scale);
      output.writeFieldEnd();
    }
    if (this.precision != null) {
      output.writeFieldBegin('precision', thrift.Thrift.Type.I32, 2);
      output.writeI32(this.precision);
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
            _args.scale = value_1;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_2 = input.readI32();
            _args.precision = value_2;
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
    if (_args.scale !== undefined && _args.precision !== undefined) {
      return new DecimalType(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read DecimalType from input');
    }
  }
}
//# sourceMappingURL=DecimalType.js.map