import { encodeBSONSync } from './lib/encoders/encode-bson';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const BSONWriter = {
  name: 'BSON',
  id: 'bson',
  module: 'bson',
  version: VERSION,
  extensions: ['bson'],
  options: {
    bson: {}
  },
  async encode(data, options) {
    return encodeBSONSync(data, {});
  },
  encodeSync(data, options) {
    return encodeBSONSync(data, {});
  }
};
//# sourceMappingURL=bson-writer.js.map