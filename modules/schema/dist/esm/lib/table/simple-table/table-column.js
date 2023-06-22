import { getArrayTypeFromDataType } from './data-type';
export function makeColumnFromField(field, length) {
  const ArrayType = getArrayTypeFromDataType(field.type, field.nullable);
  return new ArrayType(length);
}
//# sourceMappingURL=table-column.js.map