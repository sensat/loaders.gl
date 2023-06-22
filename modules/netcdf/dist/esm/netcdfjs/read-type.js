export const TYPES = {
  BYTE: 1,
  CHAR: 2,
  SHORT: 3,
  INT: 4,
  FLOAT: 5,
  DOUBLE: 6
};
export function readType(buffer, type, size) {
  switch (type) {
    case TYPES.BYTE:
      return buffer.readBytes(size);
    case TYPES.CHAR:
      return trimNull(buffer.readChars(size));
    case TYPES.SHORT:
      return readNumber(size, buffer.readInt16.bind(buffer));
    case TYPES.INT:
      return readNumber(size, buffer.readInt32.bind(buffer));
    case TYPES.FLOAT:
      return readNumber(size, buffer.readFloat32.bind(buffer));
    case TYPES.DOUBLE:
      return readNumber(size, buffer.readFloat64.bind(buffer));
    default:
      throw new Error("NetCDF: non valid type ".concat(type));
  }
}
export function num2str(type) {
  switch (Number(type)) {
    case TYPES.BYTE:
      return 'byte';
    case TYPES.CHAR:
      return 'char';
    case TYPES.SHORT:
      return 'short';
    case TYPES.INT:
      return 'int';
    case TYPES.FLOAT:
      return 'float';
    case TYPES.DOUBLE:
      return 'double';
    default:
      return 'undefined';
  }
}
export function num2bytes(type) {
  switch (Number(type)) {
    case TYPES.BYTE:
      return 1;
    case TYPES.CHAR:
      return 1;
    case TYPES.SHORT:
      return 2;
    case TYPES.INT:
      return 4;
    case TYPES.FLOAT:
      return 4;
    case TYPES.DOUBLE:
      return 8;
    default:
      return -1;
  }
}
export function str2num(type) {
  switch (String(type)) {
    case 'byte':
      return TYPES.BYTE;
    case 'char':
      return TYPES.CHAR;
    case 'short':
      return TYPES.SHORT;
    case 'int':
      return TYPES.INT;
    case 'float':
      return TYPES.FLOAT;
    case 'double':
      return TYPES.DOUBLE;
    default:
      return -1;
  }
}
function readNumber(size, bufferReader) {
  if (size !== 1) {
    const numbers = new Array(size);
    for (let i = 0; i < size; i++) {
      numbers[i] = bufferReader();
    }
    return numbers;
  }
  return bufferReader();
}
function trimNull(value) {
  if (value.charCodeAt(value.length - 1) === 0) {
    return value.substring(0, value.length - 1);
  }
  return value;
}
//# sourceMappingURL=read-type.js.map