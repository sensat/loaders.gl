import { parseXMLSync } from './lib/parsers/parse-xml';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const XMLLoader = {
  name: 'XML',
  id: 'xml',
  module: 'xml',
  version: VERSION,
  worker: false,
  extensions: ['xml'],
  mimeTypes: ['application/xml', 'text/xml'],
  testText: testXMLFile,
  options: {
    xml: {
      _parser: 'fast-xml-parser',
      uncapitalizeKeys: false,
      removeNSPrefix: false,
      textNodeName: 'value',
      arrayPaths: []
    }
  },
  parse: async (arrayBuffer, options) => parseXMLSync(new TextDecoder().decode(arrayBuffer), {
    ...XMLLoader.options.xml,
    ...(options === null || options === void 0 ? void 0 : options.xml)
  }),
  parseTextSync: (text, options) => parseXMLSync(text, {
    ...XMLLoader.options.xml,
    ...(options === null || options === void 0 ? void 0 : options.xml)
  })
};
function testXMLFile(text) {
  return text.startsWith('<?xml');
}
//# sourceMappingURL=xml-loader.js.map