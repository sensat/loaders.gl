import { StreamingXMLParser } from './streaming-xml-parser';
import { uncapitalizeKeys } from '../xml-utils/uncapitalize';
import { XMLParser as FastXMLParser } from 'fast-xml-parser';
export function parseXMLSync(text, options) {
  if (options !== null && options !== void 0 && options._parser && options._parser !== 'fast-xml-parser') {
    throw new Error(options === null || options === void 0 ? void 0 : options._parser);
  }
  const fastXMLOptions = {
    allowBooleanAttributes: true,
    ignoreDeclaration: true,
    removeNSPrefix: options === null || options === void 0 ? void 0 : options.removeNSPrefix,
    textNodeName: options === null || options === void 0 ? void 0 : options.textNodeName,
    isArray: (name, jpath, isLeafNode, isAttribute) => {
      var _options$arrayPaths;
      const array = Boolean(options === null || options === void 0 ? void 0 : (_options$arrayPaths = options.arrayPaths) === null || _options$arrayPaths === void 0 ? void 0 : _options$arrayPaths.some(path => jpath === path));
      return array;
    },
    ...(options === null || options === void 0 ? void 0 : options._fastXML)
  };
  const xml = fastParseXML(text, fastXMLOptions);
  return options !== null && options !== void 0 && options.uncapitalizeKeys ? uncapitalizeKeys(xml) : xml;
}
export function fastParseXML(text, options) {
  const parser = new FastXMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    ...options
  });
  const parsedXML = parser.parse(text);
  return parsedXML;
}
export function parseXMLInBatches(text) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const parser = new StreamingXMLParser({
    ...options,
    strict: true
  });
  parser.write(text);
  parser.close();
  return parser.result;
}
//# sourceMappingURL=parse-xml.js.map