import { parseSLPK } from './lib/parsers/parse-slpk/parse-slpk';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const SLPKLoader = {
  name: 'I3S SLPK (Scene Layer Package)',
  id: 'slpk',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/octet-stream'],
  parse: parseSLPK,
  extensions: ['slpk'],
  options: {}
};
//# sourceMappingURL=i3s-slpk-loader.js.map