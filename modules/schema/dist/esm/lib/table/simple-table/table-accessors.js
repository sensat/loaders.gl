export function getTableLength(table) {
  switch (table.shape) {
    case 'array-row-table':
    case 'object-row-table':
    case 'geojson-row-table':
      return table.data.length;
    case 'arrow-table':
      return table.data.numRows;
    case 'columnar-table':
      for (const column of Object.values(table.data)) {
        return column.length || 0;
      }
      return 0;
    default:
      throw new Error('table');
  }
}
export function getTableNumCols(table) {
  if (table.schema) {
    return table.schema.fields.length;
  }
  if (getTableLength(table) === 0) {
    throw new Error('empty table');
  }
  switch (table.shape) {
    case 'array-row-table':
      return table.data[0].length;
    case 'object-row-table':
    case 'geojson-row-table':
      return Object.keys(table.data[0]).length;
    case 'columnar-table':
      return Object.keys(table.data).length;
    case 'arrow-table':
      return table.data.numCols;
    default:
      throw new Error('table');
  }
}
export function getTableCell(table, rowIndex, columnName) {
  var _table$data$getChildA;
  switch (table.shape) {
    case 'array-row-table':
      const columnIndex = getTableColumnIndex(table, columnName);
      return table.data[rowIndex][columnIndex];
    case 'object-row-table':
    case 'geojson-row-table':
      return table.data[rowIndex][columnName];
    case 'columnar-table':
      const column = table.data[columnName];
      return column[rowIndex];
    case 'arrow-table':
      const arrowColumnIndex = table.data.schema.fields.findIndex(field => field.name === columnName);
      return (_table$data$getChildA = table.data.getChildAt(arrowColumnIndex)) === null || _table$data$getChildA === void 0 ? void 0 : _table$data$getChildA.get(rowIndex);
    default:
      throw new Error('todo');
  }
}
export function getTableCellAt(table, rowIndex, columnIndex) {
  var _table$data$getChildA2;
  switch (table.shape) {
    case 'array-row-table':
      return table.data[rowIndex][columnIndex];
    case 'object-row-table':
    case 'geojson-row-table':
      let columnName = getTableColumnName(table, columnIndex);
      return table.data[rowIndex][columnName];
    case 'columnar-table':
      columnName = getTableColumnName(table, columnIndex);
      const column = table.data[columnName];
      return column[rowIndex];
    case 'arrow-table':
      return (_table$data$getChildA2 = table.data.getChildAt(columnIndex)) === null || _table$data$getChildA2 === void 0 ? void 0 : _table$data$getChildA2.get(rowIndex);
    default:
      throw new Error('todo');
  }
}
export function getTableRowShape(table) {
  switch (table.shape) {
    case 'array-row-table':
    case 'object-row-table':
      return table.shape;
    case 'geojson-row-table':
      return 'object-row-table';
    case 'columnar-table':
    default:
      throw new Error('Not a row table');
  }
}
export function getTableColumnIndex(table, columnName) {
  var _table$schema;
  const columnIndex = (_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields.findIndex(field => field.name === columnName);
  if (columnIndex === undefined) {
    throw new Error(columnName);
  }
  return columnIndex;
}
export function getTableColumnName(table, columnIndex) {
  var _table$schema2, _table$schema2$fields;
  const columnName = (_table$schema2 = table.schema) === null || _table$schema2 === void 0 ? void 0 : (_table$schema2$fields = _table$schema2.fields[columnIndex]) === null || _table$schema2$fields === void 0 ? void 0 : _table$schema2$fields.name;
  if (!columnName) {
    throw new Error("".concat(columnIndex));
  }
  return columnName;
}
export function getTableRowAsObject(table, rowIndex, target, copy) {
  switch (table.shape) {
    case 'object-row-table':
      return copy ? Object.fromEntries(Object.entries(table.data[rowIndex])) : table.data[rowIndex];
    case 'array-row-table':
    case 'geojson-row-table':
      if (table.schema) {
        const objectRow = target || {};
        for (let i = 0; i < table.schema.fields.length; i++) {
          objectRow[table.schema.fields[i].name] = table.data[rowIndex][i];
        }
        return objectRow;
      }
      throw new Error('no schema');
    case 'columnar-table':
      if (table.schema) {
        const objectRow = target || {};
        for (let i = 0; i < table.schema.fields.length; i++) {
          objectRow[table.schema.fields[i].name] = table.data[table.schema.fields[i].name][rowIndex];
        }
        return objectRow;
      } else {
        const objectRow = target || {};
        for (const [name, column] of Object.entries(table.data)) {
          objectRow[name] = column[rowIndex];
        }
        return objectRow;
      }
    case 'arrow-table':
      const objectRow = target || {};
      const row = table.data.get(rowIndex);
      const schema = table.data.schema;
      for (let i = 0; i < schema.fields.length; i++) {
        objectRow[schema.fields[i].name] = row === null || row === void 0 ? void 0 : row[schema.fields[i].name];
      }
      return objectRow;
    default:
      throw new Error('shape');
  }
}
export function getTableRowAsArray(table, rowIndex, target, copy) {
  switch (table.shape) {
    case 'array-row-table':
      return copy ? Array.from(table.data[rowIndex]) : table.data[rowIndex];
    case 'object-row-table':
    case 'geojson-row-table':
      if (table.schema) {
        const arrayRow = target || [];
        for (let i = 0; i < table.schema.fields.length; i++) {
          arrayRow[i] = table.data[rowIndex][table.schema.fields[i].name];
        }
        return arrayRow;
      }
      return Object.values(table.data[rowIndex]);
    case 'columnar-table':
      if (table.schema) {
        const arrayRow = target || [];
        for (let i = 0; i < table.schema.fields.length; i++) {
          arrayRow[i] = table.data[table.schema.fields[i].name][rowIndex];
        }
        return arrayRow;
      } else {
        const arrayRow = target || [];
        let i = 0;
        for (const column of Object.values(table.data)) {
          arrayRow[i] = column[rowIndex];
          i++;
        }
        return arrayRow;
      }
    case 'arrow-table':
      const arrayRow = target || [];
      const row = table.data.get(rowIndex);
      const schema = table.data.schema;
      for (let i = 0; i < schema.fields.length; i++) {
        arrayRow[i] = row === null || row === void 0 ? void 0 : row[schema.fields[i].name];
      }
      return arrayRow;
    default:
      throw new Error('shape');
  }
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
export function makeColumnarTable(table) {
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
export function* makeRowIterator(table, shape) {
  switch (shape) {
    case 'array-row-table':
      yield* makeArrayRowIterator(table);
      break;
    case 'object-row-table':
      yield* makeObjectRowIterator(table);
      break;
    default:
      throw new Error("Unknown row type ".concat(shape));
  }
}
export function makeArrayRowIterator(table) {
  let target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return function* () {
    const length = getTableLength(table);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
      yield getTableRowAsArray(table, rowIndex, target);
    }
  }();
}
export function makeObjectRowIterator(table) {
  let target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function* () {
    const length = getTableLength(table);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
      yield getTableRowAsObject(table, rowIndex, target);
    }
  }();
}
//# sourceMappingURL=table-accessors.js.map