import { VERSION } from './lib/utils/version';
import encodeWKT from './lib/encode-wkt';
export const WKTWriter = {
  name: 'WKT (Well Known Text)',
  id: 'wkt',
  module: 'wkt',
  version: VERSION,
  extensions: ['wkt'],
  encode: encodeWKT,
  options: {
    wkt: {}
  }
};
//# sourceMappingURL=wkt-writer.js.map