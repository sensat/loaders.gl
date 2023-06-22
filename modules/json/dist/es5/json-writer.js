"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONWriter = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonEncoder = require("./lib/encoders/json-encoder");
var JSONWriter = {
  id: 'json',
  version: 'latest',
  module: 'json',
  name: 'JSON',
  extensions: ['json'],
  mimeTypes: ['application/json'],
  options: {},
  text: true,
  encode: function () {
    var _encode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(table, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new TextEncoder().encode((0, _jsonEncoder.encodeTableAsJSON)(table, options)).buffer);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function encode(_x, _x2) {
      return _encode.apply(this, arguments);
    }
    return encode;
  }(),
  encodeText: function encodeText(table, options) {
    return (0, _jsonEncoder.encodeTableAsJSON)(table, options);
  }
};
exports.JSONWriter = JSONWriter;
//# sourceMappingURL=json-writer.js.map