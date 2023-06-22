"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuantizedMeshLoader = void 0;
Object.defineProperty(exports, "QuantizedMeshWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _quantizedMeshLoader.QuantizedMeshLoader;
  }
});
exports.TerrainLoader = void 0;
Object.defineProperty(exports, "TerrainWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _terrainLoader.TerrainLoader;
  }
});
exports.parseTerrain = parseTerrain;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _parseQuantizedMesh = require("./lib/parse-quantized-mesh");
var _parseTerrain2 = require("./lib/parse-terrain");
var _terrainLoader = require("./terrain-loader");
var _quantizedMeshLoader = require("./quantized-mesh-loader");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var TerrainLoader = _objectSpread(_objectSpread({}, _terrainLoader.TerrainLoader), {}, {
  parse: parseTerrain
});
exports.TerrainLoader = TerrainLoader;
function parseTerrain(_x, _x2, _x3) {
  return _parseTerrain.apply(this, arguments);
}
function _parseTerrain() {
  _parseTerrain = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, options, context) {
    var loadImageOptions, image, terrainOptions;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          loadImageOptions = _objectSpread(_objectSpread({}, options), {}, {
            mimeType: 'application/x.image',
            image: _objectSpread(_objectSpread({}, options === null || options === void 0 ? void 0 : options.image), {}, {
              type: 'data'
            })
          });
          _context2.next = 3;
          return context === null || context === void 0 ? void 0 : context.parse(arrayBuffer, loadImageOptions);
        case 3:
          image = _context2.sent;
          terrainOptions = _objectSpread(_objectSpread({}, TerrainLoader.options.terrain), options === null || options === void 0 ? void 0 : options.terrain);
          return _context2.abrupt("return", (0, _parseTerrain2.makeTerrainMeshFromImage)(image, terrainOptions));
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _parseTerrain.apply(this, arguments);
}
var QuantizedMeshLoader = _objectSpread(_objectSpread({}, _quantizedMeshLoader.QuantizedMeshLoader), {}, {
  parseSync: function parseSync(arrayBuffer, options) {
    return (0, _parseQuantizedMesh.parseQuantizedMesh)(arrayBuffer, options === null || options === void 0 ? void 0 : options['quantized-mesh']);
  },
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parseQuantizedMesh.parseQuantizedMesh)(arrayBuffer, options === null || options === void 0 ? void 0 : options['quantized-mesh']));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x4, _x5) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }()
});
exports.QuantizedMeshLoader = QuantizedMeshLoader;
//# sourceMappingURL=index.js.map