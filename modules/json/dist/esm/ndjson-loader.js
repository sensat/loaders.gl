import { parseNDJSONSync } from './lib/parsers/parse-ndjson';
import { parseNDJSONInBatches } from './lib/parsers/parse-ndjson-in-batches';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const NDJSONLoader = {
  name: 'NDJSON',
  id: 'ndjson',
  module: 'json',
  version: VERSION,
  extensions: ['ndjson', 'jsonl'],
  mimeTypes: ['application/x-ndjson', 'application/jsonlines', 'application/json-seq'],
  category: 'table',
  text: true,
  parse: async arrayBuffer => parseNDJSONSync(new TextDecoder().decode(arrayBuffer)),
  parseTextSync: parseNDJSONSync,
  parseInBatches: parseNDJSONInBatches,
  options: {}
};
//# sourceMappingURL=ndjson-loader.js.map