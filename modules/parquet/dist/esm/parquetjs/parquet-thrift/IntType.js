import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
export class IntType {
  constructor(args) {
    _defineProperty(this, "bitWidth", void 0);
    _defineProperty(this, "isSigned", void 0);
    if (args != null && args.bitWidth != null) {
      this.bitWidth = args.bitWidth;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[bitWidth] is unset!');
    }
    if (args != null && args.isSigned != null) {
      this.isSigned = args.isSigned;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[isSigned] is unset!');
    }
  }
  write(output) {
    output.writeStructBegin('IntType');
    if (this.bitWidth != null) {
      output.writeFieldBegin('bitWidth', thrift.Thrift.Type.BYTE, 1);
      output.writeByte(this.bitWidth);
      output.writeFieldEnd();
    }
    if (this.isSigned != null) {
      output.writeFieldBegin('isSigned', thrift.Thrift.Type.BOOL, 2);
      output.writeBool(this.isSigned);
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
          if (fieldType === thrift.Thrift.Type.BYTE) {
            const value_1 = input.readByte();
            _args.bitWidth = value_1;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.BOOL) {
            const value_2 = input.readBool();
            _args.isSigned = value_2;
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
    if (_args.bitWidth !== undefined && _args.isSigned !== undefined) {
      return new IntType(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read IntType from input');
    }
  }
}
//# sourceMappingURL=IntType.js.map