import { parseGML } from './lib/parsers/gml/parse-gml';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const GMLLoader = {
  name: 'GML',
  id: 'gml',
  module: 'wms',
  version: VERSION,
  worker: false,
  extensions: ['xml'],
  mimeTypes: ['application/vnd.ogc.gml', 'application/xml', 'text/xml'],
  testText: testXMLFile,
  options: {
    gml: {}
  },
  parse: async (arrayBuffer, options) => parseGML(new TextDecoder().decode(arrayBuffer), options),
  parseTextSync: (text, options) => parseGML(text, options)
};
function testXMLFile(text) {
  return text.startsWith('<?xml');
}
export const _typecheckGMLLoader = GMLLoader;
//# sourceMappingURL=gml-loader.js.map