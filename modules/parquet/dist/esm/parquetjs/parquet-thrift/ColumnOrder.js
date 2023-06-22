import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
import * as TypeDefinedOrder from './TypeDefinedOrder';
export class ColumnOrder {
  constructor(args) {
    _defineProperty(this, "TYPE_ORDER", void 0);
    let _fieldsSet = 0;
    if (args != null) {
      if (args.TYPE_ORDER != null) {
        _fieldsSet++;
        this.TYPE_ORDER = args.TYPE_ORDER;
      }
      if (_fieldsSet > 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
      } else if (_fieldsSet < 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
      }
    }
  }
  static fromTYPE_ORDER(TYPE_ORDER) {
    return new ColumnOrder({
      TYPE_ORDER
    });
  }
  write(output) {
    output.writeStructBegin('ColumnOrder');
    if (this.TYPE_ORDER != null) {
      output.writeFieldBegin('TYPE_ORDER', thrift.Thrift.Type.STRUCT, 1);
      this.TYPE_ORDER.write(output);
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
            const value_1 = TypeDefinedOrder.TypeDefinedOrder.read(input);
            _returnValue = ColumnOrder.fromTYPE_ORDER(value_1);
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
//# sourceMappingURL=ColumnOrder.js.map