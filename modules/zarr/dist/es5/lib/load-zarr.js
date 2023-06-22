"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadZarr = loadZarr;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _utils = require("./utils");
var _zarrPixelSource = _interopRequireDefault(require("./zarr-pixel-source"));
function loadZarr(_x) {
  return _loadZarr.apply(this, arguments);
}
function _loadZarr() {
  _loadZarr = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(root) {
    var _options$labels;
    var options,
      store,
      _yield$loadMultiscale,
      data,
      rootAttrs,
      tileSize,
      labels,
      pyramid,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          store = (0, _utils.normalizeStore)(root);
          _context.next = 4;
          return (0, _utils.loadMultiscales)(store);
        case 4:
          _yield$loadMultiscale = _context.sent;
          data = _yield$loadMultiscale.data;
          rootAttrs = _yield$loadMultiscale.rootAttrs;
          tileSize = (0, _utils.guessTileSize)(data[0]);
          labels = (_options$labels = options.labels) !== null && _options$labels !== void 0 ? _options$labels : (0, _utils.guessLabels)(rootAttrs);
          if ((0, _utils.validLabels)(labels, data[0].shape)) {
            _context.next = 11;
            break;
          }
          throw new Error('Invalid labels for Zarr array dimensions.');
        case 11:
          pyramid = data.map(function (arr) {
            return new _zarrPixelSource.default(arr, labels, tileSize);
          });
          return _context.abrupt("return", {
            data: pyramid,
            metadata: rootAttrs
          });
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _loadZarr.apply(this, arguments);
}
//# sourceMappingURL=load-zarr.js.map