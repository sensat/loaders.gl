import { parseDBF, parseDBFInBatches } from './lib/parsers/parse-dbf';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const DBFWorkerLoader = {
  name: 'DBF',
  id: 'dbf',
  module: 'shapefile',
  version: VERSION,
  worker: true,
  category: 'table',
  extensions: ['dbf'],
  mimeTypes: ['application/x-dbf'],
  options: {
    dbf: {
      encoding: 'latin1'
    }
  }
};
export const DBFLoader = {
  ...DBFWorkerLoader,
  parse: async (arrayBuffer, options) => parseDBF(arrayBuffer, options),
  parseSync: parseDBF,
  parseInBatches: parseDBFInBatches
};
//# sourceMappingURL=dbf-loader.js.map