import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as thrift from 'thrift';
import * as Statistics from './Statistics';
export class DataPageHeader {
  constructor(args) {
    _defineProperty(this, "num_values", void 0);
    _defineProperty(this, "encoding", void 0);
    _defineProperty(this, "definition_level_encoding", void 0);
    _defineProperty(this, "repetition_level_encoding", void 0);
    _defineProperty(this, "statistics", void 0);
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
    if (args != null && args.definition_level_encoding != null) {
      this.definition_level_encoding = args.definition_level_encoding;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[definition_level_encoding] is unset!');
    }
    if (args != null && args.repetition_level_encoding != null) {
      this.repetition_level_encoding = args.repetition_level_encoding;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[repetition_level_encoding] is unset!');
    }
    if (args != null && args.statistics != null) {
      this.statistics = args.statistics;
    }
  }
  write(output) {
    output.writeStructBegin('DataPageHeader');
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
    if (this.definition_level_encoding != null) {
      output.writeFieldBegin('definition_level_encoding', thrift.Thrift.Type.I32, 3);
      output.writeI32(this.definition_level_encoding);
      output.writeFieldEnd();
    }
    if (this.repetition_level_encoding != null) {
      output.writeFieldBegin('repetition_level_encoding', thrift.Thrift.Type.I32, 4);
      output.writeI32(this.repetition_level_encoding);
      output.writeFieldEnd();
    }
    if (this.statistics != null) {
      output.writeFieldBegin('statistics', thrift.Thrift.Type.STRUCT, 5);
      this.statistics.write(output);
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
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_3 = input.readI32();
            _args.definition_level_encoding = value_3;
          } else {
            input.skip(fieldType);
          }
          break;
        case 4:
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_4 = input.readI32();
            _args.repetition_level_encoding = value_4;
          } else {
            input.skip(fieldType);
          }
          break;
        case 5:
          if (fieldType === thrift.Thrift.Type.STRUCT) {
            const value_5 = Statistics.Statistics.read(input);
            _args.statistics = value_5;
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
    if (_args.num_values !== undefined && _args.encoding !== undefined && _args.definition_level_encoding !== undefined && _args.repetition_level_encoding !== undefined) {
      return new DataPageHeader(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read DataPageHeader from input');
    }
  }
}
//# sourceMappingURL=DataPageHeader.js.map