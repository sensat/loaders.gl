"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fastParseXML = fastParseXML;
exports.parseXMLInBatches = parseXMLInBatches;
exports.parseXMLSync = parseXMLSync;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _streamingXmlParser = require("./streaming-xml-parser");
var _uncapitalize = require("../xml-utils/uncapitalize");
var _fastXmlParser = require("fast-xml-parser");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function parseXMLSync(text, options) {
  if (options !== null && options !== void 0 && options._parser && options._parser !== 'fast-xml-parser') {
    throw new Error(options === null || options === void 0 ? void 0 : options._parser);
  }
  var fastXMLOptions = _objectSpread({
    allowBooleanAttributes: true,
    ignoreDeclaration: true,
    removeNSPrefix: options === null || options === void 0 ? void 0 : options.removeNSPrefix,
    textNodeName: options === null || options === void 0 ? void 0 : options.textNodeName,
    isArray: function isArray(name, jpath, isLeafNode, isAttribute) {
      var _options$arrayPaths;
      var array = Boolean(options === null || options === void 0 ? void 0 : (_options$arrayPaths = options.arrayPaths) === null || _options$arrayPaths === void 0 ? void 0 : _options$arrayPaths.some(function (path) {
        return jpath === path;
      }));
      return array;
    }
  }, options === null || options === void 0 ? void 0 : options._fastXML);
  var xml = fastParseXML(text, fastXMLOptions);
  return options !== null && options !== void 0 && options.uncapitalizeKeys ? (0, _uncapitalize.uncapitalizeKeys)(xml) : xml;
}
function fastParseXML(text, options) {
  var parser = new _fastXmlParser.XMLParser(_objectSpread({
    ignoreAttributes: false,
    attributeNamePrefix: ''
  }, options));
  var parsedXML = parser.parse(text);
  return parsedXML;
}
function parseXMLInBatches(text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parser = new _streamingXmlParser.StreamingXMLParser(_objectSpread(_objectSpread({}, options), {}, {
    strict: true
  }));
  parser.write(text);
  parser.close();
  return parser.result;
}
//# sourceMappingURL=parse-xml.js.map