"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I3SBuildingSceneLayerLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parseI3sBuildingSceneLayer = require("./lib/parsers/parse-i3s-building-scene-layer");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
var I3SBuildingSceneLayerLoader = {
  name: 'I3S Building Scene Layer',
  id: 'i3s-building-scene-layer',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/json'],
  parse: parse,
  extensions: ['json'],
  options: {}
};
exports.I3SBuildingSceneLayerLoader = I3SBuildingSceneLayerLoader;
function parse(_x, _x2, _x3) {
  return _parse.apply(this, arguments);
}
function _parse() {
  _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data, options, context) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (context !== null && context !== void 0 && context.url) {
            _context.next = 2;
            break;
          }
          throw new Error('Url is not provided');
        case 2:
          return _context.abrupt("return", (0, _parseI3sBuildingSceneLayer.parseBuildingSceneLayer)(data, context.url));
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parse.apply(this, arguments);
}
//# sourceMappingURL=i3s-building-scene-layer-loader.js.map