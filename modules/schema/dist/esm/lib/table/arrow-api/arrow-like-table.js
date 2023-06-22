import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { ArrowLikeSchema } from './arrow-like-schema';
import { deduceTableSchema } from '../simple-table/table-schema';
import { getTableCell, getTableLength, getTableNumCols } from '../simple-table/table-accessors';
class ArrowLikeVector {
  constructor(table, columnName) {
    _defineProperty(this, "table", void 0);
    _defineProperty(this, "columnName", void 0);
    this.table = table;
    this.columnName = columnName;
  }
  get(rowIndex) {
    return getTableCell(this.table, rowIndex, this.columnName);
  }
  toArray() {
    var _this$table$data$getC;
    switch (this.table.shape) {
      case 'arrow-table':
        return (_this$table$data$getC = this.table.data.getChild(this.columnName)) === null || _this$table$data$getC === void 0 ? void 0 : _this$table$data$getC.toArray();
      case 'columnar-table':
        return this.table.data[this.columnName];
      default:
        throw new Error(this.table.shape);
    }
  }
}
export class ArrowLikeTable {
  constructor(table) {
    _defineProperty(this, "schema", void 0);
    _defineProperty(this, "table", void 0);
    const schema = table.schema || deduceTableSchema(table);
    this.schema = new ArrowLikeSchema(schema.fields, schema.metadata);
    this.table = {
      ...table,
      schema
    };
  }
  get data() {
    return this.table.data;
  }
  get numCols() {
    return getTableNumCols(this.table);
  }
  get length() {
    return getTableLength(this.table);
  }
  getChild(columnName) {
    return new ArrowLikeVector(this.table, columnName);
  }
}
//# sourceMappingURL=arrow-like-table.js.map