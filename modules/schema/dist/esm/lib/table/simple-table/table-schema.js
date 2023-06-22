import { getDataTypeFromArray, getDataTypeFromValue } from './data-type';
export function deduceTableSchema(table) {
  switch (table.shape) {
    case 'array-row-table':
    case 'object-row-table':
      return deduceSchemaFromRows(table.data);
    case 'columnar-table':
      return deduceSchemaFromColumns(table.data);
    case 'arrow-table':
    default:
      throw new Error('Deduce schema');
  }
}
export function deduceSchema(data) {
  return Array.isArray(data) ? deduceSchemaFromRows(data) : deduceSchemaFromColumns(data);
}
function deduceSchemaFromColumns(columnarTable) {
  const fields = [];
  for (const [columnName, column] of Object.entries(columnarTable)) {
    const field = deduceFieldFromColumn(column, columnName);
    fields.push(field);
  }
  return {
    fields,
    metadata: {}
  };
}
function deduceSchemaFromRows(rowTable) {
  if (!rowTable.length) {
    throw new Error('deduce from empty table');
  }
  const fields = [];
  const row0 = rowTable[0];
  for (const [columnName, value] of Object.entries(row0)) {
    fields.push(deduceFieldFromValue(value, columnName));
  }
  return {
    fields,
    metadata: {}
  };
}
function deduceFieldFromColumn(column, name) {
  if (ArrayBuffer.isView(column)) {
    const type = getDataTypeFromArray(column);
    return {
      name,
      type: type.type || 'null',
      nullable: type.nullable
    };
  }
  if (Array.isArray(column) && column.length > 0) {
    const value = column[0];
    const type = getDataTypeFromValue(value);
    return {
      name,
      type,
      nullable: true
    };
  }
  throw new Error('empty table');
}
function deduceFieldFromValue(value, name) {
  const type = getDataTypeFromValue(value);
  return {
    name,
    type,
    nullable: true
  };
}
//# sourceMappingURL=table-schema.js.map