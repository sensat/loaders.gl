"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XMLLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parseXml = require("./lib/parsers/parse-xml");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var XMLLoader = {
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
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parseXml.parseXMLSync)(new TextDecoder().decode(arrayBuffer), _objectSpread(_objectSpread({}, XMLLoader.options.xml), options === null || options === void 0 ? void 0 : options.xml)));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x, _x2) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }(),
  parseTextSync: function parseTextSync(text, options) {
    return (0, _parseXml.parseXMLSync)(text, _objectSpread(_objectSpread({}, XMLLoader.options.xml), options === null || options === void 0 ? void 0 : options.xml));
  }
};
exports.XMLLoader = XMLLoader;
function testXMLFile(text) {
  return text.startsWith('<?xml');
}
//# sourceMappingURL=xml-loader.js.map