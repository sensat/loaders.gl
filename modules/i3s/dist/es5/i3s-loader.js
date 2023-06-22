"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I3SLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@loaders.gl/core");
var _i3sContentLoader = require("./i3s-content-loader");
var _parseI3s = require("./lib/parsers/parse-i3s");
var _constants = require("./lib/parsers/constants");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var TILESET_REGEX = /layers\/[0-9]+$/;
var TILE_HEADER_REGEX = /nodes\/([0-9-]+|root)$/;
var SLPK_HEX = '504b0304';
var POINT_CLOUD = 'PointCloud';
var I3SLoader = {
  name: 'I3S (Indexed Scene Layers)',
  id: 'i3s',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/octet-stream'],
  parse: parseI3S,
  extensions: ['bin'],
  options: {
    i3s: {
      token: null,
      isTileset: 'auto',
      isTileHeader: 'auto',
      tile: null,
      tileset: null,
      _tileOptions: null,
      _tilesetOptions: null,
      useDracoGeometry: true,
      useCompressedTextures: true,
      decodeTextures: true,
      coordinateSystem: _constants.COORDINATE_SYSTEM.METER_OFFSETS,
      colorsByAttribute: null
    }
  }
};
exports.I3SLoader = I3SLoader;
function parseI3S(_x) {
  return _parseI3S.apply(this, arguments);
}
function _parseI3S() {
  _parseI3S = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var options,
      context,
      url,
      magicNumber,
      isTileset,
      isTileHeader,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          context = _args.length > 2 ? _args[2] : undefined;
          url = context.url;
          options.i3s = options.i3s || {};
          magicNumber = getMagicNumber(data);
          if (!(magicNumber === SLPK_HEX)) {
            _context.next = 7;
            break;
          }
          throw new Error('Files with .slpk extention currently are not supported by I3SLoader');
        case 7:
          if (options.i3s.isTileset === 'auto') {
            isTileset = TILESET_REGEX.test(url);
          } else {
            isTileset = options.i3s.isTileset;
          }
          if (options.isTileHeader === 'auto') {
            isTileHeader = TILE_HEADER_REGEX.test(url);
          } else {
            isTileHeader = options.i3s.isTileHeader;
          }
          if (!isTileset) {
            _context.next = 15;
            break;
          }
          _context.next = 12;
          return parseTileset(data, options, context);
        case 12:
          data = _context.sent;
          _context.next = 24;
          break;
        case 15:
          if (!isTileHeader) {
            _context.next = 21;
            break;
          }
          _context.next = 18;
          return parseTile(data, context);
        case 18:
          data = _context.sent;
          _context.next = 24;
          break;
        case 21:
          _context.next = 23;
          return parseTileContent(data, options);
        case 23:
          data = _context.sent;
        case 24:
          return _context.abrupt("return", data);
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseI3S.apply(this, arguments);
}
function parseTileContent(_x2, _x3) {
  return _parseTileContent.apply(this, arguments);
}
function _parseTileContent() {
  _parseTileContent = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, options) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _core.parse)(arrayBuffer, _i3sContentLoader.I3SContentLoader, options);
        case 2:
          return _context2.abrupt("return", _context2.sent);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _parseTileContent.apply(this, arguments);
}
function parseTileset(_x4, _x5, _x6) {
  return _parseTileset.apply(this, arguments);
}
function _parseTileset() {
  _parseTileset = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(data, options, context) {
    var tilesetJson;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          tilesetJson = JSON.parse(new TextDecoder().decode(data));
          if (!((tilesetJson === null || tilesetJson === void 0 ? void 0 : tilesetJson.layerType) === POINT_CLOUD)) {
            _context3.next = 3;
            break;
          }
          throw new Error('Point Cloud layers currently are not supported by I3SLoader');
        case 3:
          tilesetJson.loader = I3SLoader;
          _context3.next = 6;
          return (0, _parseI3s.normalizeTilesetData)(tilesetJson, options, context);
        case 6:
          return _context3.abrupt("return", tilesetJson);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _parseTileset.apply(this, arguments);
}
function parseTile(_x7, _x8) {
  return _parseTile.apply(this, arguments);
}
function _parseTile() {
  _parseTile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(data, context) {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          data = JSON.parse(new TextDecoder().decode(data));
          return _context4.abrupt("return", (0, _parseI3s.normalizeTileData)(data, context));
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _parseTile.apply(this, arguments);
}
function getMagicNumber(data) {
  if (data instanceof ArrayBuffer) {
    return (0, _toConsumableArray2.default)(new Uint8Array(data, 0, 4)).map(function (value) {
      return value.toString(16).padStart(2, '0');
    }).join('');
  }
  return null;
}
//# sourceMappingURL=i3s-loader.js.map