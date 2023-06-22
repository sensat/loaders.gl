"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXMLInBatches = exports.fastParseXML = exports.parseXMLSync = void 0;
const streaming_xml_parser_1 = require("./streaming-xml-parser");
const uncapitalize_1 = require("../xml-utils/uncapitalize");
const fast_xml_parser_1 = require("fast-xml-parser");
function parseXMLSync(text, options) {
    if (options?._parser && options._parser !== 'fast-xml-parser') {
        throw new Error(options?._parser);
    }
    const fastXMLOptions = {
        // Default FastXML options
        // https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md#allowbooleanattributes
        allowBooleanAttributes: true,
        // https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md#ignoredeclaration
        ignoreDeclaration: true,
        // https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md#removensprefix
        removeNSPrefix: options?.removeNSPrefix,
        // https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md#textnodename
        textNodeName: options?.textNodeName,
        // Let's application specify keys that are always arrays
        isArray: (name, jpath, isLeafNode, isAttribute) => {
            const array = Boolean(options?.arrayPaths?.some((path) => jpath === path));
            return array;
        },
        // Application overrides
        ...options?._fastXML
    };
    const xml = fastParseXML(text, fastXMLOptions);
    // Note - could be done with FastXML tag processing
    return options?.uncapitalizeKeys ? (0, uncapitalize_1.uncapitalizeKeys)(xml) : xml;
}
exports.parseXMLSync = parseXMLSync;
function fastParseXML(text, options) {
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        ...options
    });
    const parsedXML = parser.parse(text);
    return parsedXML;
}
exports.fastParseXML = fastParseXML;
/**
 * @todo Build a streaming XML parser based on sax-js
 * @param text
 * @param options
 * @returns
 */
function parseXMLInBatches(text, options = {}) {
    const parser = new streaming_xml_parser_1.StreamingXMLParser({
        ...options,
        strict: true
    });
    parser.write(text);
    parser.close();
    return parser.result;
}
exports.parseXMLInBatches = parseXMLInBatches;
