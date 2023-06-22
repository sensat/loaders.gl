import { ParquetRowGroup } from './declare';
import * as Types from './types';
export { ParquetRowGroup };
export function shredBuffer(schema) {
  const columnData = {};
  for (const field of schema.fieldList) {
    columnData[field.key] = {
      dlevels: [],
      rlevels: [],
      values: [],
      pageHeaders: [],
      count: 0
    };
  }
  return {
    rowCount: 0,
    columnData
  };
}
export function shredRecord(schema, record, rowGroup) {
  const data = shredBuffer(schema).columnData;
  shredRecordFields(schema.fields, record, data, 0, 0);
  if (rowGroup.rowCount === 0) {
    rowGroup.rowCount = 1;
    rowGroup.columnData = data;
    return;
  }
  rowGroup.rowCount += 1;
  for (const field of schema.fieldList) {
    Array.prototype.push.apply(rowGroup.columnData[field.key].rlevels, data[field.key].rlevels);
    Array.prototype.push.apply(rowGroup.columnData[field.key].dlevels, data[field.key].dlevels);
    Array.prototype.push.apply(rowGroup.columnData[field.key].values, data[field.key].values);
    rowGroup.columnData[field.key].count += data[field.key].count;
  }
}
function shredRecordFields(fields, record, data, rLevel, dLevel) {
  for (const name in fields) {
    const field = fields[name];
    let values = [];
    if (record && field.name in record && record[field.name] !== undefined && record[field.name] !== null) {
      if (record[field.name].constructor === Array) {
        values = record[field.name];
      } else {
        values.push(record[field.name]);
      }
    }
    if (values.length === 0 && Boolean(record) && field.repetitionType === 'REQUIRED') {
      throw new Error("missing required field: ".concat(field.name));
    }
    if (values.length > 1 && field.repetitionType !== 'REPEATED') {
      throw new Error("too many values for field: ".concat(field.name));
    }
    if (values.length === 0) {
      if (field.isNested) {
        shredRecordFields(field.fields, null, data, rLevel, dLevel);
      } else {
        data[field.key].count += 1;
        data[field.key].rlevels.push(rLevel);
        data[field.key].dlevels.push(dLevel);
      }
      continue;
    }
    for (let i = 0; i < values.length; i++) {
      const rlvl = i === 0 ? rLevel : field.rLevelMax;
      if (field.isNested) {
        shredRecordFields(field.fields, values[i], data, rlvl, field.dLevelMax);
      } else {
        data[field.key].count += 1;
        data[field.key].rlevels.push(rlvl);
        data[field.key].dlevels.push(field.dLevelMax);
        data[field.key].values.push(Types.toPrimitive(field.originalType || field.primitiveType, values[i]));
      }
    }
  }
}
export function materializeRows(schema, rowGroup) {
  const rows = [];
  for (let i = 0; i < rowGroup.rowCount; i++) {
    rows.push({});
  }
  for (const key in rowGroup.columnData) {
    const columnData = rowGroup.columnData[key];
    if (columnData.count) {
      materializeColumnAsRows(schema, columnData, key, rows);
    }
  }
  return rows;
}
function materializeColumnAsRows(schema, columnData, key, rows) {
  const field = schema.findField(key);
  const branch = schema.findFieldBranch(key);
  const rLevels = new Array(field.rLevelMax + 1).fill(0);
  let vIndex = 0;
  for (let i = 0; i < columnData.count; i++) {
    const dLevel = columnData.dlevels[i];
    const rLevel = columnData.rlevels[i];
    rLevels[rLevel]++;
    rLevels.fill(0, rLevel + 1);
    let rIndex = 0;
    let record = rows[rLevels[rIndex++] - 1];
    for (const step of branch) {
      if (step === field || dLevel < step.dLevelMax) {
        break;
      }
      switch (step.repetitionType) {
        case 'REPEATED':
          if (!(step.name in record)) {
            record[step.name] = [];
          }
          const ix = rLevels[rIndex++];
          while (record[step.name].length <= ix) {
            record[step.name].push({});
          }
          record = record[step.name][ix];
          break;
        default:
          record[step.name] = record[step.name] || {};
          record = record[step.name];
      }
    }
    if (dLevel === field.dLevelMax) {
      const value = Types.fromPrimitive(field.originalType || field.primitiveType, columnData.values[vIndex], field);
      vIndex++;
      switch (field.repetitionType) {
        case 'REPEATED':
          if (!(field.name in record)) {
            record[field.name] = [];
          }
          const ix = rLevels[rIndex];
          while (record[field.name].length <= ix) {
            record[field.name].push(null);
          }
          record[field.name][ix] = value;
          break;
        default:
          record[field.name] = value;
      }
    }
  }
}
export function materializeColumns(schema, rowGroup) {
  const columns = {};
  for (const key in rowGroup.columnData) {
    const columnData = rowGroup.columnData[key];
    if (columnData.count) {
      materializeColumnAsColumnarArray(schema, columnData, rowGroup.rowCount, key, columns);
    }
  }
  return columns;
}
function materializeColumnAsColumnarArray(schema, columnData, rowCount, key, columns) {
  if (columnData.count <= 0) {
    return;
  }
  const field = schema.findField(key);
  const branch = schema.findFieldBranch(key);
  const columnName = branch[0].name;
  let column;
  const {
    values
  } = columnData;
  if (values.length === rowCount && branch[0].primitiveType) {
    column = values;
  }
  if (column) {
    columns[columnName] = column;
    return;
  }
  column = new Array(rowCount);
  for (let i = 0; i < rowCount; i++) {
    column[i] = {};
  }
  columns[columnName] = column;
  const rLevels = new Array(field.rLevelMax + 1).fill(0);
  let vIndex = 0;
  for (let i = 0; i < columnData.count; i++) {
    const dLevel = columnData.dlevels[i];
    const rLevel = columnData.rlevels[i];
    rLevels[rLevel]++;
    rLevels.fill(0, rLevel + 1);
    let rIndex = 0;
    let record = column[rLevels[rIndex++] - 1];
    for (const step of branch) {
      if (step === field || dLevel < step.dLevelMax) {
        break;
      }
      switch (step.repetitionType) {
        case 'REPEATED':
          if (!(step.name in record)) {
            record[step.name] = [];
          }
          const ix = rLevels[rIndex++];
          while (record[step.name].length <= ix) {
            record[step.name].push({});
          }
          record = record[step.name][ix];
          break;
        default:
          record[step.name] = record[step.name] || {};
          record = record[step.name];
      }
    }
    if (dLevel === field.dLevelMax) {
      const value = Types.fromPrimitive(field.originalType || field.primitiveType, columnData.values[vIndex], field);
      vIndex++;
      switch (field.repetitionType) {
        case 'REPEATED':
          if (!(field.name in record)) {
            record[field.name] = [];
          }
          const ix = rLevels[rIndex];
          while (record[field.name].length <= ix) {
            record[field.name].push(null);
          }
          record[field.name][ix] = value;
          break;
        default:
          record[field.name] = value;
      }
    }
  }
  for (let i = 0; i < rowCount; ++i) {
    if (columnName in column[i]) {
      column[i] = column[i][columnName];
    }
  }
}
//# sourceMappingURL=shred.js.map