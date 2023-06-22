import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as ColumnOrder from './ColumnOrder';
import * as KeyValue from './KeyValue';
import * as RowGroup from './RowGroup';
import * as SchemaElement from './SchemaElement';
export class FileMetaData {
  constructor() {
    let args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _defineProperty(this, "version", void 0);
    _defineProperty(this, "schema", void 0);
    _defineProperty(this, "num_rows", void 0);
    _defineProperty(this, "row_groups", void 0);
    _defineProperty(this, "key_value_metadata", void 0);
    _defineProperty(this, "created_by", void 0);
    _defineProperty(this, "column_orders", void 0);
    if (args != null && args.version != null) {
      this.version = args.version;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[version] is unset!');
    }
    if (args != null && args.schema != null) {
      this.schema = args.schema;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[schema] is unset!');
    }
    if (args != null && args.num_rows != null) {
      if (typeof args.num_rows === 'number') {
        this.num_rows = new Int64(args.num_rows);
      } else {
        this.num_rows = args.num_rows;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_rows] is unset!');
    }
    if (args != null && args.row_groups != null) {
      this.row_groups = args.row_groups;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[row_groups] is unset!');
    }
    if (args != null && args.key_value_metadata != null) {
      this.key_value_metadata = args.key_value_metadata;
    }
    if (args != null && args.created_by != null) {
      this.created_by = args.created_by;
    }
    if (args != null && args.column_orders != null) {
      this.column_orders = args.column_orders;
    }
  }
  write(output) {
    output.writeStructBegin('FileMetaData');
    if (this.version != null) {
      output.writeFieldBegin('version', thrift.Thrift.Type.I32, 1);
      output.writeI32(this.version);
      output.writeFieldEnd();
    }
    if (this.schema != null) {
      output.writeFieldBegin('schema', thrift.Thrift.Type.LIST, 2);
      output.writeListBegin(thrift.Thrift.Type.STRUCT, this.schema.length);
      this.schema.forEach(value_1 => {
        value_1.write(output);
      });
      output.writeListEnd();
      output.writeFieldEnd();
    }
    if (this.num_rows != null) {
      output.writeFieldBegin('num_rows', thrift.Thrift.Type.I64, 3);
      output.writeI64(this.num_rows);
      output.writeFieldEnd();
    }
    if (this.row_groups != null) {
      output.writeFieldBegin('row_groups', thrift.Thrift.Type.LIST, 4);
      output.writeListBegin(thrift.Thrift.Type.STRUCT, this.row_groups.length);
      this.row_groups.forEach(value_2 => {
        value_2.write(output);
      });
      output.writeListEnd();
      output.writeFieldEnd();
    }
    if (this.key_value_metadata != null) {
      output.writeFieldBegin('key_value_metadata', thrift.Thrift.Type.LIST, 5);
      output.writeListBegin(thrift.Thrift.Type.STRUCT, this.key_value_metadata.length);
      this.key_value_metadata.forEach(value_3 => {
        value_3.write(output);
      });
      output.writeListEnd();
      output.writeFieldEnd();
    }
    if (this.created_by != null) {
      output.writeFieldBegin('created_by', thrift.Thrift.Type.STRING, 6);
      output.writeString(this.created_by);
      output.writeFieldEnd();
    }
    if (this.column_orders != null) {
      output.writeFieldBegin('column_orders', thrift.Thrift.Type.LIST, 7);
      output.writeListBegin(thrift.Thrift.Type.STRUCT, this.column_orders.length);
      this.column_orders.forEach(value_4 => {
        value_4.write(output);
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
          if (fieldType === thrift.Thrift.Type.I32) {
            const value_5 = input.readI32();
            _args.version = value_5;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_6 = new Array();
            const metadata_1 = input.readListBegin();
            const size_1 = metadata_1.size;
            for (let i_1 = 0; i_1 < size_1; i_1++) {
              const value_7 = SchemaElement.SchemaElement.read(input);
              value_6.push(value_7);
            }
            input.readListEnd();
            _args.schema = value_6;
          } else {
            input.skip(fieldType);
          }
          break;
        case 3:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_8 = input.readI64();
            _args.num_rows = value_8;
          } else {
            input.skip(fieldType);
          }
          break;
        case 4:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_9 = new Array();
            const metadata_2 = input.readListBegin();
            const size_2 = metadata_2.size;
            for (let i_2 = 0; i_2 < size_2; i_2++) {
              const value_10 = RowGroup.RowGroup.read(input);
              value_9.push(value_10);
            }
            input.readListEnd();
            _args.row_groups = value_9;
          } else {
            input.skip(fieldType);
          }
          break;
        case 5:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_11 = new Array();
            const metadata_3 = input.readListBegin();
            const size_3 = metadata_3.size;
            for (let i_3 = 0; i_3 < size_3; i_3++) {
              const value_12 = KeyValue.KeyValue.read(input);
              value_11.push(value_12);
            }
            input.readListEnd();
            _args.key_value_metadata = value_11;
          } else {
            input.skip(fieldType);
          }
          break;
        case 6:
          if (fieldType === thrift.Thrift.Type.STRING) {
            const value_13 = input.readString();
            _args.created_by = value_13;
          } else {
            input.skip(fieldType);
          }
          break;
        case 7:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_14 = new Array();
            const metadata_4 = input.readListBegin();
            const size_4 = metadata_4.size;
            for (let i_4 = 0; i_4 < size_4; i_4++) {
              const value_15 = ColumnOrder.ColumnOrder.read(input);
              value_14.push(value_15);
            }
            input.readListEnd();
            _args.column_orders = value_14;
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
    if (_args.version !== undefined && _args.schema !== undefined && _args.num_rows !== undefined && _args.row_groups !== undefined) {
      return new FileMetaData(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read FileMetaData from input');
    }
  }
}
//# sourceMappingURL=FileMetaData.js.map