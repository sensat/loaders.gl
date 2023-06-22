"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BSONLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parseBson = require("./lib/parsers/parse-bson");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_BSON_LOADER_OPTIONS = {
  bson: {}
};
var BSONLoader = {
  name: 'BSON',
  id: 'bson',
  module: 'bson',
  version: VERSION,
  extensions: ['bson'],
  mimeTypes: ['application/bson'],
  category: 'json',
  binary: true,
  parse: parse,
  parseSync: parseSync,
  options: DEFAULT_BSON_LOADER_OPTIONS
};
exports.BSONLoader = BSONLoader;
function parse(_x, _x2) {
  return _parse.apply(this, arguments);
}
function _parse() {
  _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
    var bsonOptions;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          bsonOptions = _objectSpread(_objectSpread({}, DEFAULT_BSON_LOADER_OPTIONS.bson), options === null || options === void 0 ? void 0 : options.bson);
          return _context.abrupt("return", (0, _parseBson.parseBSONSync)(arrayBuffer, bsonOptions));
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parse.apply(this, arguments);
}
function parseSync(arrayBuffer, options) {
  var bsonOptions = _objectSpread(_objectSpread({}, DEFAULT_BSON_LOADER_OPTIONS.bson), options === null || options === void 0 ? void 0 : options.bson);
  return (0, _parseBson.parseBSONSync)(arrayBuffer, bsonOptions);
}
//# sourceMappingURL=bson-loader.js.map