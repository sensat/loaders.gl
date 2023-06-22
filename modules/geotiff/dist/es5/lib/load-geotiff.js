"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGeoTiff = loadGeoTiff;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _geotiff = require("geotiff");
var _proxies = require("./utils/proxies");
var _loadOmeTiff = require("./ome/load-ome-tiff");
function loadGeoTiff(_x) {
  return _loadGeoTiff.apply(this, arguments);
}
function _loadGeoTiff() {
  _loadGeoTiff = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(source) {
    var opts,
      headers,
      offsets,
      tiff,
      firstImage,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          opts = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          headers = opts.headers, offsets = opts.offsets;
          if (!(source instanceof _geotiff.GeoTIFF)) {
            _context.next = 6;
            break;
          }
          tiff = source;
          _context.next = 15;
          break;
        case 6:
          if (!(typeof source === 'string')) {
            _context.next = 12;
            break;
          }
          _context.next = 9;
          return (0, _geotiff.fromUrl)(source, headers);
        case 9:
          tiff = _context.sent;
          _context.next = 15;
          break;
        case 12:
          _context.next = 14;
          return (0, _geotiff.fromBlob)(source);
        case 14:
          tiff = _context.sent;
        case 15:
          if (offsets) {
            tiff = (0, _proxies.createOffsetsProxy)(tiff, offsets);
          }
          (0, _proxies.checkProxies)(tiff);
          _context.next = 19;
          return tiff.getImage(0);
        case 19:
          firstImage = _context.sent;
          if (!(0, _loadOmeTiff.isOmeTiff)(firstImage)) {
            _context.next = 22;
            break;
          }
          return _context.abrupt("return", (0, _loadOmeTiff.loadOmeTiff)(tiff, firstImage));
        case 22:
          throw new Error('GeoTIFF not recognized.');
        case 23:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _loadGeoTiff.apply(this, arguments);
}
//# sourceMappingURL=load-geotiff.js.map