import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as ColumnChunk from './ColumnChunk';
import * as SortingColumn from './SortingColumn';
export class RowGroup {
  constructor(args) {
    _defineProperty(this, "columns", void 0);
    _defineProperty(this, "total_byte_size", void 0);
    _defineProperty(this, "num_rows", void 0);
    _defineProperty(this, "sorting_columns", void 0);
    if (args != null && args.columns != null) {
      this.columns = args.columns;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[columns] is unset!');
    }
    if (args != null && args.total_byte_size != null) {
      if (typeof args.total_byte_size === 'number') {
        this.total_byte_size = new Int64(args.total_byte_size);
      } else {
        this.total_byte_size = args.total_byte_size;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[total_byte_size] is unset!');
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
    if (args != null && args.sorting_columns != null) {
      this.sorting_columns = args.sorting_columns;
    }
  }
  write(output) {
    output.writeStructBegin('RowGroup');
    if (this.columns != null) {
      output.writeFieldBegin('columns', thrift.Thrift.Type.LIST, 1);
      output.writeListBegin(thrift.Thrift.Type.STRUCT, this.columns.length);
      this.columns.forEach(value_1 => {
        value_1.write(output);
      });
      output.writeListEnd();
      output.writeFieldEnd();
    }
    if (this.total_byte_size != null) {
      output.writeFieldBegin('total_byte_size', thrift.Thrift.Type.I64, 2);
      output.writeI64(this.total_byte_size);
      output.writeFieldEnd();
    }
    if (this.num_rows != null) {
      output.writeFieldBegin('num_rows', thrift.Thrift.Type.I64, 3);
      output.writeI64(this.num_rows);
      output.writeFieldEnd();
    }
    if (this.sorting_columns != null) {
      output.writeFieldBegin('sorting_columns', thrift.Thrift.Type.LIST, 4);
      output.writeListBegin(thrift.Thrift.Type.STRUCT, this.sorting_columns.length);
      this.sorting_columns.forEach(value_2 => {
        value_2.write(output);
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
            const value_3 = new Array();
            const metadata_1 = input.readListBegin();
            const size_1 = metadata_1.size;
            for (let i_1 = 0; i_1 < size_1; i_1++) {
              const value_4 = ColumnChunk.ColumnChunk.read(input);
              value_3.push(value_4);
            }
            input.readListEnd();
            _args.columns = value_3;
          } else {
            input.skip(fieldType);
          }
          break;
        case 2:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_5 = input.readI64();
            _args.total_byte_size = value_5;
          } else {
            input.skip(fieldType);
          }
          break;
        case 3:
          if (fieldType === thrift.Thrift.Type.I64) {
            const value_6 = input.readI64();
            _args.num_rows = value_6;
          } else {
            input.skip(fieldType);
          }
          break;
        case 4:
          if (fieldType === thrift.Thrift.Type.LIST) {
            const value_7 = new Array();
            const metadata_2 = input.readListBegin();
            const size_2 = metadata_2.size;
            for (let i_2 = 0; i_2 < size_2; i_2++) {
              const value_8 = SortingColumn.SortingColumn.read(input);
              value_7.push(value_8);
            }
            input.readListEnd();
            _args.sorting_columns = value_7;
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
    if (_args.columns !== undefined && _args.total_byte_size !== undefined && _args.num_rows !== undefined) {
      return new RowGroup(_args);
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read RowGroup from input');
    }
  }
}
//# sourceMappingURL=RowGroup.js.map