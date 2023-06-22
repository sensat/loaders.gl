import { VERSION } from './lib/utils/version';
import parseWKT from './lib/parse-wkt';
export const WKTWorkerLoader = {
  name: 'WKT (Well-Known Text)',
  id: 'wkt',
  module: 'wkt',
  version: VERSION,
  worker: true,
  extensions: ['wkt'],
  mimeTypes: ['text/plain'],
  category: 'geometry',
  text: true,
  options: {
    wkt: {}
  }
};
export const WKTLoader = {
  ...WKTWorkerLoader,
  parse: async arrayBuffer => parseWKT(new TextDecoder().decode(arrayBuffer)),
  parseTextSync: parseWKT
};
//# sourceMappingURL=wkt-loader.js.map