export function convertParquetRowGroupToColumns(schema, rowGroup) {
  const columns = {};
  for (const [columnName, data] of Object.entries(rowGroup.columnData)) {
    columns[columnName] = columns[columnName] || data.values;
  }
  return columns;
}
//# sourceMappingURL=convert-row-group-to-columns.js.map