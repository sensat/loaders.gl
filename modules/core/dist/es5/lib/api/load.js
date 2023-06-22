"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _isType = require("../../javascript-utils/is-type");
var _normalizeLoader = require("../loader-utils/normalize-loader");
var _getFetchFunction = require("../loader-utils/get-fetch-function");
var _parse = require("./parse");
function load(_x, _x2, _x3, _x4) {
  return _load.apply(this, arguments);
}
function _load() {
  _load = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(url, loaders, options, context) {
    var resolvedLoaders, resolvedOptions, fetch, data;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!Array.isArray(loaders) && !(0, _normalizeLoader.isLoaderObject)(loaders)) {
            resolvedLoaders = [];
            resolvedOptions = loaders;
            context = undefined;
          } else {
            resolvedLoaders = loaders;
            resolvedOptions = options;
          }
          fetch = (0, _getFetchFunction.getFetchFunction)(resolvedOptions);
          data = url;
          if (!(typeof url === 'string')) {
            _context.next = 7;
            break;
          }
          _context.next = 6;
          return fetch(url);
        case 6:
          data = _context.sent;
        case 7:
          if (!(0, _isType.isBlob)(url)) {
            _context.next = 11;
            break;
          }
          _context.next = 10;
          return fetch(url);
        case 10:
          data = _context.sent;
        case 11:
          if (!Array.isArray(resolvedLoaders)) {
            _context.next = 17;
            break;
          }
          _context.next = 14;
          return (0, _parse.parse)(data, resolvedLoaders, resolvedOptions);
        case 14:
          _context.t0 = _context.sent;
          _context.next = 20;
          break;
        case 17:
          _context.next = 19;
          return (0, _parse.parse)(data, resolvedLoaders, resolvedOptions);
        case 19:
          _context.t0 = _context.sent;
        case 20:
          return _context.abrupt("return", _context.t0);
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _load.apply(this, arguments);
}
//# sourceMappingURL=load.js.map