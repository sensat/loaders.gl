"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLLoader = void 0;
const parse_xml_1 = require("./lib/parsers/parse-xml");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Loader for XML files
 */
exports.XMLLoader = {
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
    parse: async (arrayBuffer, options) => (0, parse_xml_1.parseXMLSync)(new TextDecoder().decode(arrayBuffer), {
        ...exports.XMLLoader.options.xml,
        ...options?.xml
    }),
    parseTextSync: (text, options) => (0, parse_xml_1.parseXMLSync)(text, { ...exports.XMLLoader.options.xml, ...options?.xml })
};
function testXMLFile(text) {
    // TODO - There could be space first.
    return text.startsWith('<?xml');
}
