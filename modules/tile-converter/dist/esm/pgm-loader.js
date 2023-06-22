import { parsePGM } from '@math.gl/geoid';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const PGMLoader = {
  name: 'PGM - Netpbm grayscale image format',
  id: 'pgm',
  module: 'tile-converter',
  version: VERSION,
  mimeTypes: ['image/x-portable-graymap'],
  parse: async (arrayBuffer, options) => parsePGM(new Uint8Array(arrayBuffer), options),
  extensions: ['pgm'],
  options: {
    cubic: false
  }
};
//# sourceMappingURL=pgm-loader.js.map