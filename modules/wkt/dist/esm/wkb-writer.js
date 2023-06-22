import { VERSION } from './lib/utils/version';
import encodeWKB from './lib/encode-wkb';
export const WKBWriter = {
  name: 'WKB (Well Known Binary)',
  id: 'wkb',
  module: 'wkt',
  version: VERSION,
  extensions: ['wkb'],
  encodeSync: encodeWKB,
  options: {
    wkb: {
      hasZ: false,
      hasM: false
    }
  }
};
//# sourceMappingURL=wkb-writer.js.map