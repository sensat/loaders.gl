"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckWKBWorkerLoader = exports._typecheckWKBLoader = exports.WKBWorkerLoader = exports.WKBLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _version = require("./lib/utils/version");
var _parseWkb = _interopRequireDefault(require("./lib/parse-wkb"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var WKBWorkerLoader = {
  name: 'WKB',
  id: 'wkb',
  module: 'wkt',
  version: _version.VERSION,
  worker: true,
  category: 'geometry',
  extensions: ['wkb'],
  mimeTypes: [],
  options: {
    wkb: {}
  }
};
exports.WKBWorkerLoader = WKBWorkerLoader;
var WKBLoader = _objectSpread(_objectSpread({}, WKBWorkerLoader), {}, {
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parseWkb.default)(arrayBuffer));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }(),
  parseSync: _parseWkb.default
});
exports.WKBLoader = WKBLoader;
var _typecheckWKBWorkerLoader = WKBWorkerLoader;
exports._typecheckWKBWorkerLoader = _typecheckWKBWorkerLoader;
var _typecheckWKBLoader = WKBLoader;
exports._typecheckWKBLoader = _typecheckWKBLoader;
//# sourceMappingURL=wkb-loader.js.map