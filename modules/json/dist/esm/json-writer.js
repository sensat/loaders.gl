import { encodeTableAsJSON } from './lib/encoders/json-encoder';
export const JSONWriter = {
  id: 'json',
  version: 'latest',
  module: 'json',
  name: 'JSON',
  extensions: ['json'],
  mimeTypes: ['application/json'],
  options: {},
  text: true,
  encode: async (table, options) => new TextEncoder().encode(encodeTableAsJSON(table, options)).buffer,
  encodeText: (table, options) => encodeTableAsJSON(table, options)
};
//# sourceMappingURL=json-writer.js.map