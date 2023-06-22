import { parseBSONSync } from './lib/parsers/parse-bson';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const DEFAULT_BSON_LOADER_OPTIONS = {
  bson: {}
};
export const BSONLoader = {
  name: 'BSON',
  id: 'bson',
  module: 'bson',
  version: VERSION,
  extensions: ['bson'],
  mimeTypes: ['application/bson'],
  category: 'json',
  binary: true,
  parse,
  parseSync,
  options: DEFAULT_BSON_LOADER_OPTIONS
};
async function parse(arrayBuffer, options) {
  const bsonOptions = {
    ...DEFAULT_BSON_LOADER_OPTIONS.bson,
    ...(options === null || options === void 0 ? void 0 : options.bson)
  };
  return parseBSONSync(arrayBuffer, bsonOptions);
}
function parseSync(arrayBuffer, options) {
  const bsonOptions = {
    ...DEFAULT_BSON_LOADER_OPTIONS.bson,
    ...(options === null || options === void 0 ? void 0 : options.bson)
  };
  return parseBSONSync(arrayBuffer, bsonOptions);
}
//# sourceMappingURL=bson-loader.js.map