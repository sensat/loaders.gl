"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _tiffUtils = require("./utils/tiff-utils");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var TiffPixelSource = function () {
  function TiffPixelSource(indexer, dtype, tileSize, shape, labels, meta) {
    (0, _classCallCheck2.default)(this, TiffPixelSource);
    (0, _defineProperty2.default)(this, "dtype", void 0);
    (0, _defineProperty2.default)(this, "tileSize", void 0);
    (0, _defineProperty2.default)(this, "shape", void 0);
    (0, _defineProperty2.default)(this, "labels", void 0);
    (0, _defineProperty2.default)(this, "meta", void 0);
    (0, _defineProperty2.default)(this, "_indexer", void 0);
    this._indexer = indexer;
    this.dtype = dtype;
    this.tileSize = tileSize;
    this.shape = shape;
    this.labels = labels;
    this.meta = meta;
  }
  (0, _createClass2.default)(TiffPixelSource, [{
    key: "getRaster",
    value: function () {
      var _getRaster = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(_ref) {
        var selection, signal, image;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              selection = _ref.selection, signal = _ref.signal;
              _context.next = 3;
              return this._indexer(selection);
            case 3:
              image = _context.sent;
              return _context.abrupt("return", this._readRasters(image, {
                signal: signal
              }));
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getRaster(_x) {
        return _getRaster.apply(this, arguments);
      }
      return getRaster;
    }()
  }, {
    key: "getTile",
    value: function () {
      var _getTile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(_ref2) {
        var x, y, selection, signal, _this$_getTileExtent, height, width, x0, y0, window, image;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              x = _ref2.x, y = _ref2.y, selection = _ref2.selection, signal = _ref2.signal;
              _this$_getTileExtent = this._getTileExtent(x, y), height = _this$_getTileExtent.height, width = _this$_getTileExtent.width;
              x0 = x * this.tileSize;
              y0 = y * this.tileSize;
              window = [x0, y0, x0 + width, y0 + height];
              _context2.next = 7;
              return this._indexer(selection);
            case 7:
              image = _context2.sent;
              return _context2.abrupt("return", this._readRasters(image, {
                window: window,
                width: width,
                height: height,
                signal: signal
              }));
            case 9:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getTile(_x2) {
        return _getTile.apply(this, arguments);
      }
      return getTile;
    }()
  }, {
    key: "_readRasters",
    value: function () {
      var _readRasters2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(image, props) {
        var _props$signal;
        var interleave, raster, data;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              interleave = (0, _tiffUtils.isInterleaved)(this.shape);
              _context3.next = 3;
              return image.readRasters(_objectSpread({
                interleave: interleave
              }, props));
            case 3:
              raster = _context3.sent;
              if (!(props !== null && props !== void 0 && (_props$signal = props.signal) !== null && _props$signal !== void 0 && _props$signal.aborted)) {
                _context3.next = 6;
                break;
              }
              throw _tiffUtils.SIGNAL_ABORTED;
            case 6:
              data = interleave ? raster : raster[0];
              return _context3.abrupt("return", {
                data: data,
                width: raster.width,
                height: raster.height
              });
            case 8:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function _readRasters(_x3, _x4) {
        return _readRasters2.apply(this, arguments);
      }
      return _readRasters;
    }()
  }, {
    key: "_getTileExtent",
    value: function _getTileExtent(x, y) {
      var _getImageSize = (0, _tiffUtils.getImageSize)(this),
        zoomLevelHeight = _getImageSize.height,
        zoomLevelWidth = _getImageSize.width;
      var height = this.tileSize;
      var width = this.tileSize;
      var maxXTileCoord = Math.floor(zoomLevelWidth / this.tileSize);
      var maxYTileCoord = Math.floor(zoomLevelHeight / this.tileSize);
      if (x === maxXTileCoord) {
        width = zoomLevelWidth % this.tileSize;
      }
      if (y === maxYTileCoord) {
        height = zoomLevelHeight % this.tileSize;
      }
      return {
        height: height,
        width: width
      };
    }
  }, {
    key: "onTileError",
    value: function onTileError(err) {
      console.error(err);
    }
  }]);
  return TiffPixelSource;
}();
var _default = TiffPixelSource;
exports.default = _default;
//# sourceMappingURL=tiff-pixel-source.js.map