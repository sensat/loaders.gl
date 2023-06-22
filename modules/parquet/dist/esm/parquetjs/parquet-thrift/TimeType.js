import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
import * as TimeUnit from './TimeUnit';
export class TimeType {
  constructor(args) {
    _defineProperty(this, "isAdjustedToUTC", void 0);
    _defineProperty(this, "unit", void 0);
    if (args != null && args.isAdjustedToUTC != null) {
      this.isAdjustedToUTC = args.isAdjustedToUTC;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[isAdjustedToUTC] is unset!');
    }
    if (args != null && args.unit != null) {
      this.unit = args.unit;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[unit] is unset!');
    }
  }
  write(output) {
    output.writeStructBegin('TimeType');
    if (this.isAdjustedToUTC != null) {
      output.writeFieldBegin('isAdjustedToUTC', thrift.Thrift.Type.BOOL, 1);
      output.writeBool(this.isAdjustedToUTC);
      output.writeFieldEnd();
    }
    if (this.unit != null) {
      output.writeFieldBegin('unit', thrift.Thrift.Type.STRUCT, 2);
      this.unit.write(output);
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
          if (fieldType === thrift.Thrift.Type.BOOL) {
            const value_1 = input.readBool();
            _args.isAdjustedToUTC = value_1;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.STRUCT) {
            const value_2 = TimeUnit.TimeUnit.read(input);
            _args.unit = value_2;
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
    if (_args.isAdjustedToUTC !== undefined && _args.unit !== undefined) {
      return new TimeType(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read TimeType from input');
    }
  }
}
//# sourceMappingURL=TimeType.js.map