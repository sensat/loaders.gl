"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BSONWriter = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _encodeBson = require("./lib/encoders/encode-bson");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var BSONWriter = {
  name: 'BSON',
  id: 'bson',
  module: 'bson',
  version: VERSION,
  extensions: ['bson'],
  options: {
    bson: {}
  },
  encode: function encode(data, options) {
    return (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _encodeBson.encodeBSONSync)(data, {}));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  encodeSync: function encodeSync(data, options) {
    return (0, _encodeBson.encodeBSONSync)(data, {});
  }
};
exports.BSONWriter = BSONWriter;
//# sourceMappingURL=bson-writer.js.map