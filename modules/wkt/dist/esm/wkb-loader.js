import { VERSION } from './lib/utils/version';
import parseWKB from './lib/parse-wkb';
export const WKBWorkerLoader = {
  name: 'WKB',
  id: 'wkb',
  module: 'wkt',
  version: VERSION,
  worker: true,
  category: 'geometry',
  extensions: ['wkb'],
  mimeTypes: [],
  options: {
    wkb: {}
  }
};
export const WKBLoader = {
  ...WKBWorkerLoader,
  parse: async arrayBuffer => parseWKB(arrayBuffer),
  parseSync: parseWKB
};
export const _typecheckWKBWorkerLoader = WKBWorkerLoader;
export const _typecheckWKBLoader = WKBLoader;
//# sourceMappingURL=wkb-loader.js.map