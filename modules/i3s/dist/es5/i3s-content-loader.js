"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I3SContentLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parseI3sTileContent = require("./lib/parsers/parse-i3s-tile-content");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
var I3SContentLoader = {
  name: 'I3S Content (Indexed Scene Layers)',
  id: 'i3s-content',
  module: 'i3s',
  worker: true,
  version: VERSION,
  mimeTypes: ['application/octet-stream'],
  parse: parse,
  extensions: ['bin'],
  options: {
    'i3s-content': {}
  }
};
exports.I3SContentLoader = I3SContentLoader;
function parse(_x, _x2, _x3) {
  return _parse.apply(this, arguments);
}
function _parse() {
  _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data, options, context) {
    var _ref, tile, _tileOptions, tileset, _tilesetOptions, tileOptions, tilesetOptions;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _ref = (options === null || options === void 0 ? void 0 : options.i3s) || {}, tile = _ref.tile, _tileOptions = _ref._tileOptions, tileset = _ref.tileset, _tilesetOptions = _ref._tilesetOptions;
          tileOptions = _tileOptions || tile;
          tilesetOptions = _tilesetOptions || tileset;
          if (!(!tileOptions || !tilesetOptions)) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", null);
        case 5:
          _context.next = 7;
          return (0, _parseI3sTileContent.parseI3STileContent)(data, tileOptions, tilesetOptions, options, context);
        case 7:
          return _context.abrupt("return", _context.sent);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parse.apply(this, arguments);
}
//# sourceMappingURL=i3s-content-loader.js.map