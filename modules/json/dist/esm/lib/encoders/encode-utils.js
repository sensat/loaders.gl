import { getTableLength, getTableNumCols, getTableRowAsArray } from '@loaders.gl/schema';
export function detectGeometryColumnIndex(table) {
  var _table$schema$fields$, _table$schema;
  const geometryIndex = (_table$schema$fields$ = (_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields.findIndex(field => field.name === 'geometry')) !== null && _table$schema$fields$ !== void 0 ? _table$schema$fields$ : -1;
  if (geometryIndex > -1) {
    return geometryIndex;
  }
  if (getTableLength(table) > 0) {
    const row = getTableRowAsArray(table, 0);
    for (let columnIndex = 0; columnIndex < getTableNumCols(table); columnIndex++) {
      const value = row === null || row === void 0 ? void 0 : row[columnIndex];
      if (value && typeof value === 'object') {
        return columnIndex;
      }
    }
  }
  throw new Error('Failed to detect geometry column');
}
export function getRowPropertyObject(table, row) {
  let excludeColumnIndices = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const properties = {};
  for (let columnIndex = 0; columnIndex < getTableNumCols(table); ++columnIndex) {
    var _table$schema2;
    const columnName = (_table$schema2 = table.schema) === null || _table$schema2 === void 0 ? void 0 : _table$schema2.fields[columnIndex].name;
    if (columnName && !excludeColumnIndices.includes(columnIndex)) {
      properties[columnName] = row[columnName];
    }
  }
  return properties;
}
//# sourceMappingURL=encode-utils.js.map