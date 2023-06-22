"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DTYPE_LOOKUP = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _zarr = require("zarr");
var _utils = require("./utils");
var DTYPE_LOOKUP = {
  u1: 'Uint8',
  u2: 'Uint16',
  u4: 'Uint32',
  f4: 'Float32',
  f8: 'Float64',
  i1: 'Int8',
  i2: 'Int16',
  i4: 'Int32'
};
exports.DTYPE_LOOKUP = DTYPE_LOOKUP;
var ZarrPixelSource = function () {
  function ZarrPixelSource(data, labels, tileSize) {
    (0, _classCallCheck2.default)(this, ZarrPixelSource);
    (0, _defineProperty2.default)(this, "labels", void 0);
    (0, _defineProperty2.default)(this, "tileSize", void 0);
    (0, _defineProperty2.default)(this, "_data", void 0);
    (0, _defineProperty2.default)(this, "_indexer", void 0);
    (0, _defineProperty2.default)(this, "_readChunks", void 0);
    this._indexer = (0, _utils.getIndexer)(labels);
    this._data = data;
    var xChunkSize = data.chunks[this._xIndex];
    var yChunkSize = data.chunks[this._xIndex - 1];
    this._readChunks = tileSize === xChunkSize && tileSize === yChunkSize;
    this.labels = labels;
    this.tileSize = tileSize;
  }
  (0, _createClass2.default)(ZarrPixelSource, [{
    key: "shape",
    get: function get() {
      return this._data.shape;
    }
  }, {
    key: "dtype",
    get: function get() {
      var suffix = this._data.dtype.slice(1);
      if (!(suffix in DTYPE_LOOKUP)) {
        throw Error("Zarr dtype not supported, got ".concat(suffix, "."));
      }
      return DTYPE_LOOKUP[suffix];
    }
  }, {
    key: "_xIndex",
    get: function get() {
      var interleave = (0, _utils.isInterleaved)(this._data.shape);
      return this._data.shape.length - (interleave ? 2 : 1);
    }
  }, {
    key: "_chunkIndex",
    value: function _chunkIndex(selection, x, y) {
      var sel = this._indexer(selection);
      sel[this._xIndex] = x;
      sel[this._xIndex - 1] = y;
      return sel;
    }
  }, {
    key: "_getSlices",
    value: function _getSlices(x, y) {
      var _getImageSize = (0, _utils.getImageSize)(this),
        height = _getImageSize.height,
        width = _getImageSize.width;
      var _ref = [x * this.tileSize, Math.min((x + 1) * this.tileSize, width)],
        xStart = _ref[0],
        xStop = _ref[1];
      var _ref2 = [y * this.tileSize, Math.min((y + 1) * this.tileSize, height)],
        yStart = _ref2[0],
        yStop = _ref2[1];
      if (xStart === xStop || yStart === yStop) {
        throw new _zarr.BoundsCheckError('Tile slice is zero-sized.');
      }
      return [(0, _zarr.slice)(xStart, xStop), (0, _zarr.slice)(yStart, yStop)];
    }
  }, {
    key: "getRaster",
    value: function () {
      var _getRaster = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(_ref3) {
        var selection, sel, _ref4, data, shape, _shape, height, width;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              selection = _ref3.selection;
              sel = this._chunkIndex(selection, null, null);
              _context.next = 4;
              return this._data.getRaw(sel);
            case 4:
              _ref4 = _context.sent;
              data = _ref4.data;
              shape = _ref4.shape;
              _shape = (0, _slicedToArray2.default)(shape, 2), height = _shape[0], width = _shape[1];
              return _context.abrupt("return", {
                data: data,
                width: width,
                height: height
              });
            case 9:
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
      var _getTile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(props) {
        var x, y, selection, signal, res, _sel, _this$_getSlices, _this$_getSlices2, xSlice, ySlice, _sel2, _ref5, data, _ref5$shape, height, width;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              x = props.x, y = props.y, selection = props.selection, signal = props.signal;
              if (!this._readChunks) {
                _context2.next = 8;
                break;
              }
              _sel = this._chunkIndex(selection, x, y);
              _context2.next = 5;
              return this._data.getRawChunk(_sel, {
                storeOptions: {
                  signal: signal
                }
              });
            case 5:
              res = _context2.sent;
              _context2.next = 13;
              break;
            case 8:
              _this$_getSlices = this._getSlices(x, y), _this$_getSlices2 = (0, _slicedToArray2.default)(_this$_getSlices, 2), xSlice = _this$_getSlices2[0], ySlice = _this$_getSlices2[1];
              _sel2 = this._chunkIndex(selection, xSlice, ySlice);
              _context2.next = 12;
              return this._data.getRaw(_sel2);
            case 12:
              res = _context2.sent;
            case 13:
              _ref5 = res, data = _ref5.data, _ref5$shape = (0, _slicedToArray2.default)(_ref5.shape, 2), height = _ref5$shape[0], width = _ref5$shape[1];
              return _context2.abrupt("return", {
                data: data,
                width: width,
                height: height
              });
            case 15:
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
    key: "onTileError",
    value: function onTileError(err) {
      if (!(err instanceof _zarr.BoundsCheckError)) {
        throw err;
      }
    }
  }]);
  return ZarrPixelSource;
}();
var _default = ZarrPixelSource;
exports.default = _default;
//# sourceMappingURL=zarr-pixel-source.js.map