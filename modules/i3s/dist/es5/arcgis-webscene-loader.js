"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArcGisWebSceneLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parseArcgisWebscene = require("./lib/parsers/parse-arcgis-webscene");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
var ArcGisWebSceneLoader = {
  name: 'ArcGIS Web Scene Loader',
  id: 'arcgis-web-scene',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/json'],
  parse: parse,
  extensions: ['json'],
  options: {}
};
exports.ArcGisWebSceneLoader = ArcGisWebSceneLoader;
function parse(_x) {
  return _parse.apply(this, arguments);
}
function _parse() {
  _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _parseArcgisWebscene.parseWebscene)(data));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parse.apply(this, arguments);
}
//# sourceMappingURL=arcgis-webscene-loader.js.map