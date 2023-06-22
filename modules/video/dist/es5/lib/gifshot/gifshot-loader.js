"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGifshotModule = loadGifshotModule;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _workerUtils = require("@loaders.gl/worker-utils");
var loadGifshotPromise;
function loadGifshotModule() {
  return _loadGifshotModule.apply(this, arguments);
}
function _loadGifshotModule() {
  _loadGifshotModule = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
    var options,
      modules,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
          modules = options.modules || {};
          if (!modules.gifshot) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", modules.gifshot);
        case 4:
          loadGifshotPromise = loadGifshotPromise || loadGifshot(options);
          _context.next = 7;
          return loadGifshotPromise;
        case 7:
          return _context.abrupt("return", _context.sent);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _loadGifshotModule.apply(this, arguments);
}
function loadGifshot(_x) {
  return _loadGifshot.apply(this, arguments);
}
function _loadGifshot() {
  _loadGifshot = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(options) {
    var gifshot;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          options.libraryPath = options.libraryPath || 'libs/';
          _context2.next = 3;
          return (0, _workerUtils.loadLibrary)('gifshot.js', 'gifshot', options);
        case 3:
          gifshot = _context2.sent;
          return _context2.abrupt("return", gifshot || globalThis.gifshot);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _loadGifshot.apply(this, arguments);
}
//# sourceMappingURL=gifshot-loader.js.map