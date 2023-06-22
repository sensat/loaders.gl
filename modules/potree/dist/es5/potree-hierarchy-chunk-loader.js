"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PotreeHierarchyChunkLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parsePotreeHierarchyChunk = _interopRequireDefault(require("./parsers/parse-potree-hierarchy-chunk"));
var PotreeHierarchyChunkLoader = {
  id: 'potree',
  name: 'potree Hierarchy Chunk',
  extensions: ['hrc'],
  mimeTypes: ['application/octet-stream'],
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return parseSync(arrayBuffer);
          case 2:
            return _context.abrupt("return", _context.sent);
          case 3:
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
  parseSync: parseSync,
  binary: true
};
exports.PotreeHierarchyChunkLoader = PotreeHierarchyChunkLoader;
function parseSync(arrayBuffer) {
  return (0, _parsePotreeHierarchyChunk.default)(arrayBuffer);
}
//# sourceMappingURL=potree-hierarchy-chunk-loader.js.map