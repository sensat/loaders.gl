import { serialize } from 'bson';
export function encodeBSONSync(value, options) {
  const uint8Array = serialize(value);
  return uint8Array.buffer;
}
//# sourceMappingURL=encode-bson.js.map