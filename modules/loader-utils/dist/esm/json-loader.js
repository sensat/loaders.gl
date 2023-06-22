const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const JSONLoader = {
  name: 'JSON',
  id: 'json',
  module: 'json',
  version: VERSION,
  extensions: ['json', 'geojson'],
  mimeTypes: ['application/json'],
  category: 'json',
  text: true,
  parseTextSync,
  parse: async arrayBuffer => parseTextSync(new TextDecoder().decode(arrayBuffer)),
  options: {}
};
function parseTextSync(text) {
  return JSON.parse(text);
}
//# sourceMappingURL=json-loader.js.map