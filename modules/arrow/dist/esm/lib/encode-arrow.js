import { Table, tableToIPC, vectorFromArray } from 'apache-arrow';
import { VECTOR_TYPES } from '../types';
export function encodeArrowSync(data) {
  const vectors = {};
  for (const arrayData of data) {
    const arrayVector = createVector(arrayData.array, arrayData.type);
    vectors[arrayData.name] = arrayVector;
  }
  const table = new Table(vectors);
  const arrowBuffer = tableToIPC(table);
  return arrowBuffer;
}
function createVector(array, type) {
  switch (type) {
    case VECTOR_TYPES.DATE:
      return vectorFromArray(array);
    case VECTOR_TYPES.FLOAT:
    default:
      return vectorFromArray(array);
  }
}
//# sourceMappingURL=encode-arrow.js.map