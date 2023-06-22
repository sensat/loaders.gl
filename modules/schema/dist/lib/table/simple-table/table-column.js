"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeColumnFromField = void 0;
const data_type_1 = require("./data-type");
function makeColumnFromField(field, length) {
    const ArrayType = (0, data_type_1.getArrayTypeFromDataType)(field.type, field.nullable);
    return new ArrayType(length);
}
exports.makeColumnFromField = makeColumnFromField;
/*
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function deduceSchema(rows) {
  const row = rows[0];

  const schema = {};
  let i = 0;
  for (const columnName in row) {
    const value = row[columnName];
    switch (typeof value) {
      case 'number':
      case 'boolean':
        // TODO - booleans could be handled differently...
        schema[columnName] = {name: String(columnName), index: i, type: Float32Array};
        break;

      case 'object':
        schema[columnName] = {name: String(columnName), index: i, type: Array};
        break;

      case 'string':
      default:
        schema[columnName] = {name: String(columnName), index: i, type: Array};
      // We currently only handle numeric rows
      // TODO we could offer a function to map strings to numbers?
    }
    i++;
  }
  return schema;
}
*/
