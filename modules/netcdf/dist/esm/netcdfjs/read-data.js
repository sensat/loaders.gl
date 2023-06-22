import { readType, str2num, num2bytes } from './read-type';
export function readNonRecord(buffer, variable) {
  const type = str2num(variable.type);
  const size = variable.size / num2bytes(type);
  const data = new Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = readType(buffer, type, 1);
  }
  return data;
}
export function readRecord(buffer, variable, recordDimension) {
  const type = str2num(variable.type);
  const width = variable.size ? variable.size / num2bytes(type) : 1;
  const size = recordDimension.length;
  const data = new Array(size);
  const step = recordDimension.recordStep;
  for (let i = 0; i < size; i++) {
    const currentOffset = buffer.offset;
    data[i] = readType(buffer, type, width);
    buffer.seek(currentOffset + step);
  }
  return data;
}
//# sourceMappingURL=read-data.js.map