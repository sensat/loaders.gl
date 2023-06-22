import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
import * as PageLocation from './PageLocation';
export class OffsetIndex {
  constructor(args) {
    _defineProperty(this, "page_locations", void 0);
    if (args != null && args.page_locations != null) {
      this.page_locations = args.page_locations;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[page_locations] is unset!');
    }
  }
  write(output) {
    output.writeStructBegin('OffsetIndex');
    if (this.page_locations != null) {
      output.writeFieldBegin('page_locations', thrift.Thrift.Type.LIST, 1);
      output.writeListBegin(thrift.Thrift.Type.STRUCT, this.page_locations.length);
      this.page_locations.forEach(value_1 => {
        value_1.write(output);
      });
      output.writeListEnd();
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
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_2 = new Array();
            const metadata_1 = input.readListBegin();
            const size_1 = metadata_1.size;
            for (let i_1 = 0; i_1 < size_1; i_1++) {
              const value_3 = PageLocation.PageLocation.read(input);
              value_2.push(value_3);
            }
            input.readListEnd();
            _args.page_locations = value_2;
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
    if (_args.page_locations !== undefined) {
      return new OffsetIndex(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read OffsetIndex from input');
    }
  }
}
//# sourceMappingURL=OffsetIndex.js.map