import * as thrift from 'thrift';
export class UUIDType {
  constructor() {}
  write(output) {
    output.writeStructBegin('UUIDType');
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
    return new UUIDType();
  }
}
//# sourceMappingURL=UUIDType.js.map