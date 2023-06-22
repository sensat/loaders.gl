import { makeRowIterator } from '@loaders.gl/schema';
export function encodeTableAsJSON(table) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const shape = options.shape || 'object-row-table';
  const strings = [];
  const rowIterator = makeRowIterator(table, shape);
  for (const row of rowIterator) {
    strings.push(JSON.stringify(row));
  }
  return "[".concat(strings.join(','), "]");
}
//# sourceMappingURL=json-encoder.js.map