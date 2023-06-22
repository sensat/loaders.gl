import { parseCSWDomain } from './lib/parsers/csw/parse-csw-domain';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const CSWDomainLoader = {
  id: 'csw-domain',
  name: 'CSW Domain',
  module: 'wms',
  version: VERSION,
  worker: false,
  extensions: ['xml'],
  mimeTypes: ['application/vnd.ogc.csw_xml', 'application/xml', 'text/xml'],
  testText: testXMLFile,
  options: {
    csw: {}
  },
  parse: async (arrayBuffer, options) => parseCSWDomain(new TextDecoder().decode(arrayBuffer), options),
  parseTextSync: (text, options) => parseCSWDomain(text, options)
};
function testXMLFile(text) {
  return text.startsWith('<?xml');
}
export const _typecheckCSWDomainLoader = CSWDomainLoader;
//# sourceMappingURL=csw-domain-loader.js.map