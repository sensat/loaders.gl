import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
import * as MicroSeconds from './MicroSeconds';
import * as MilliSeconds from './MilliSeconds';
export class TimeUnit {
  constructor(args) {
    _defineProperty(this, "MILLIS", void 0);
    _defineProperty(this, "MICROS", void 0);
    let _fieldsSet = 0;
    if (args != null) {
      if (args.MILLIS != null) {
        _fieldsSet++;
        this.MILLIS = args.MILLIS;
      }
      if (args.MICROS != null) {
        _fieldsSet++;
        this.MICROS = args.MICROS;
      }
      if (_fieldsSet > 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
      } else if (_fieldsSet < 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
      }
    }
  }
  static fromMILLIS(MILLIS) {
    return new TimeUnit({
      MILLIS
    });
  }
  static fromMICROS(MICROS) {
    return new TimeUnit({
      MICROS
    });
  }
  write(output) {
    output.writeStructBegin('TimeUnit');
    if (this.MILLIS != null) {
      output.writeFieldBegin('MILLIS', thrift.Thrift.Type.STRUCT, 1);
      this.MILLIS.write(output);
      output.writeFieldEnd();
    }
    if (this.MICROS != null) {
      output.writeFieldBegin('MICROS', thrift.Thrift.Type.STRUCT, 2);
      this.MICROS.write(output);
      output.writeFieldEnd();
    }
    output.writeFieldStop();
    output.writeStructEnd();
    return;
  }
  static read(input) {
    let _fieldsSet = 0;
    let _returnValue = null;
    input.readStructBegin();
    while (true) {
      const ret = input.readFieldBegin();
      const fieldType = ret.ftype;
      const fieldId = ret.fid;
      if (fieldType === thrift.Thrift.Type.STOP) {
        break;
      }
      switch (fieldId) {
        case 1:
          if (fieldType === thrift.Thrift.Type.STRUCT) {
            _fieldsSet++;
            const value_1 = MilliSeconds.MilliSeconds.read(input);
            _returnValue = TimeUnit.fromMILLIS(value_1);
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.STRUCT) {
            _fieldsSet++;
            const value_2 = MicroSeconds.MicroSeconds.read(input);
            _returnValue = TimeUnit.fromMICROS(value_2);
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
    if (_fieldsSet > 1) {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
    } else if (_fieldsSet < 1) {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
    }
    if (_returnValue !== null) {
      return _returnValue;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read data for TUnion');
    }
  }
}
//# sourceMappingURL=TimeUnit.js.map