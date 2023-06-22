import { deduceTableSchema } from './table-schema';
export function makeTableFromData(data) {
  let table;
  switch (getTableShapeFromData(data)) {
    case 'array-row-table':
      table = {
        shape: 'array-row-table',
        data: data
      };
      break;
    case 'object-row-table':
      table = {
        shape: 'object-row-table',
        data: data
      };
      break;
    case 'columnar-table':
      table = {
        shape: 'columnar-table',
        data: data
      };
      break;
    default:
      throw new Error('table');
  }
  const schema = deduceTableSchema(table);
  return {
    ...table,
    schema
  };
}
function getTableShapeFromData(data) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('cannot deduce type of empty table');
    }
    const firstRow = data[0];
    if (Array.isArray(firstRow)) {
      return 'array-row-table';
    }
    if (firstRow && typeof firstRow === 'object') {
      return 'object-row-table';
    }
  }
  if (data && typeof data === 'object') {
    return 'columnar-table';
  }
  throw new Error('invalid table');
}
//# sourceMappingURL=make-table.js.map