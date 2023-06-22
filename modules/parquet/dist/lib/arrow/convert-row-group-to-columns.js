"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertParquetRowGroupToColumns = void 0;
function convertParquetRowGroupToColumns(schema, rowGroup) {
    const columns = {};
    for (const [columnName, data] of Object.entries(rowGroup.columnData)) {
        columns[columnName] = columns[columnName] || data.values;
    }
    return columns;
}
exports.convertParquetRowGroupToColumns = convertParquetRowGroupToColumns;
