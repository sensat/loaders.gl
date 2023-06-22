import { getTableCell, getTableLength, getTableRowAsArray, getTableRowAsObject } from './table-accessors';
import { deduceTableSchema } from './table-schema';
import { makeColumnFromField } from './table-column';
export function makeColumnarTable(table) {
  var _table$schema;
  const schema = table.schema || deduceTableSchema(table);
  const fields = ((_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields) || [];
  if (table.shape === 'columnar-table') {
    return {
      ...table,
      schema
    };
  }
  const length = getTableLength(table);
  const columns = {};
  for (const field of fields) {
    const column = makeColumnFromField(field, length);
    columns[field.name] = column;
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
      column[rowIndex] = getTableCell(table, rowIndex, field.name);
    }
  }
  return {
    shape: 'columnar-table',
    schema,
    data: columns
  };
}
export function makeArrayRowTable(table) {
  if (table.shape === 'array-row-table') {
    return table;
  }
  const length = getTableLength(table);
  const data = new Array(length);
  for (let rowIndex = 0; rowIndex < length; rowIndex++) {
    data[rowIndex] = getTableRowAsArray(table, rowIndex);
  }
  return {
    shape: 'array-row-table',
    schema: table.schema,
    data
  };
}
export function makeObjectRowTable(table) {
  if (table.shape === 'object-row-table') {
    return table;
  }
  const length = getTableLength(table);
  const data = new Array(length);
  for (let rowIndex = 0; rowIndex < length; rowIndex++) {
    data[rowIndex] = getTableRowAsObject(table, rowIndex);
  }
  return {
    shape: 'object-row-table',
    schema: table.schema,
    data
  };
}
//# sourceMappingURL=convert-table.js.map