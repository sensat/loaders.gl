"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetRowGroup = void 0;
/** @
 * Holds data for one row group (column chunks) */
class ParquetRowGroup {
    constructor(rowCount = 0, columnData = {}) {
        this.rowCount = rowCount;
        this.columnData = columnData;
    }
}
exports.ParquetRowGroup = ParquetRowGroup;
