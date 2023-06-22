import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export class ParquetRowGroup {
  constructor() {
    let rowCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let columnData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _defineProperty(this, "rowCount", void 0);
    _defineProperty(this, "columnData", void 0);
    this.rowCount = rowCount;
    this.columnData = columnData;
  }
}
//# sourceMappingURL=declare.js.map