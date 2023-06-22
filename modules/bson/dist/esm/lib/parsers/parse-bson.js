import { deserialize } from 'bson';
export function parseBSONSync(value, options) {
  const parsedData = deserialize(new Uint8Array(value), options);
  return parsedData;
}
//# sourceMappingURL=parse-bson.js.map