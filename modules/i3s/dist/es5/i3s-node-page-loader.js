"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I3SNodePageLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
function parseNodePage(_x, _x2) {
  return _parseNodePage.apply(this, arguments);
}
function _parseNodePage() {
  _parseNodePage = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data, options) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", JSON.parse(new TextDecoder().decode(data)));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseNodePage.apply(this, arguments);
}
var I3SNodePageLoader = {
  name: 'I3S Node Page',
  id: 'i3s-node-page',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/json'],
  parse: parseNodePage,
  extensions: ['json'],
  options: {}
};
exports.I3SNodePageLoader = I3SNodePageLoader;
//# sourceMappingURL=i3s-node-page-loader.js.map