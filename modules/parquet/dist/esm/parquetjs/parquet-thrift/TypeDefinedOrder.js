import * as thrift from 'thrift';
export class TypeDefinedOrder {
  constructor() {}
  write(output) {
    output.writeStructBegin('TypeDefinedOrder');
    output.writeFieldStop();
    output.writeStructEnd();
    return;
  }
  static read(input) {
    input.readStructBegin();
    while (true) {
      const ret = input.readFieldBegin();
      const fieldType = ret.ftype;
      const fieldId = ret.fid;
      if (fieldType === thrift.Thrift.Type.STOP) {
        break;
      }
      switch (fieldId) {
        default:
          {
            input.skip(fieldType);
          }
      }
      input.readFieldEnd();
    }
    input.readStructEnd();
    return new TypeDefinedOrder();
  }
}
//# sourceMappingURL=TypeDefinedOrder.js.map