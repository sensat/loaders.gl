"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PGMLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _geoid = require("@math.gl/geoid");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var PGMLoader = {
  name: 'PGM - Netpbm grayscale image format',
  id: 'pgm',
  module: 'tile-converter',
  version: VERSION,
  mimeTypes: ['image/x-portable-graymap'],
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _geoid.parsePGM)(new Uint8Array(arrayBuffer), options));
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
  extensions: ['pgm'],
  options: {
    cubic: false
  }
};
exports.PGMLoader = PGMLoader;
//# sourceMappingURL=pgm-loader.js.map