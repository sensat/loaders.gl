import { parseCSWRecords } from './lib/parsers/csw/parse-csw-records';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const CSWRecordsLoader = {
  id: 'csw-records',
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
  parse: async (arrayBuffer, options) => parseCSWRecords(new TextDecoder().decode(arrayBuffer), options),
  parseTextSync: (text, options) => parseCSWRecords(text, options)
};
function testXMLFile(text) {
  return text.startsWith('<?xml');
}
//# sourceMappingURL=csw-records-loader.js.map