"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeTileData = normalizeTileData;
exports.normalizeTileNonUrlData = normalizeTileNonUrlData;
exports.normalizeTilesetData = normalizeTilesetData;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _culling = require("@math.gl/culling");
var _geospatial = require("@math.gl/geospatial");
var _core = require("@loaders.gl/core");
var _tiles = require("@loaders.gl/tiles");
var _i3sNodepagesTiles = _interopRequireDefault(require("../helpers/i3s-nodepages-tiles"));
var _urlUtils = require("../utils/url-utils");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function normalizeTileData(tile, context) {
  var url = context.url || '';
  var contentUrl;
  if (tile.geometryData) {
    contentUrl = "".concat(url, "/").concat(tile.geometryData[0].href);
  }
  var textureUrl;
  if (tile.textureData) {
    textureUrl = "".concat(url, "/").concat(tile.textureData[0].href);
  }
  var attributeUrls;
  if (tile.attributeData) {
    attributeUrls = (0, _urlUtils.generateTileAttributeUrls)(url, tile);
  }
  return normalizeTileNonUrlData(_objectSpread(_objectSpread({}, tile), {}, {
    url: url,
    contentUrl: contentUrl,
    textureUrl: textureUrl,
    attributeUrls: attributeUrls,
    isDracoGeometry: false
  }));
}
function normalizeTileNonUrlData(tile) {
  var _tile$lodSelection, _tile$lodSelection2;
  var boundingVolume = {};
  var mbs = [0, 0, 0, 1];
  if (tile.mbs) {
    mbs = tile.mbs;
    boundingVolume.sphere = [].concat((0, _toConsumableArray2.default)(_geospatial.Ellipsoid.WGS84.cartographicToCartesian(tile.mbs.slice(0, 3))), [tile.mbs[3]]);
  } else if (tile.obb) {
    boundingVolume.box = [].concat((0, _toConsumableArray2.default)(_geospatial.Ellipsoid.WGS84.cartographicToCartesian(tile.obb.center)), (0, _toConsumableArray2.default)(tile.obb.halfSize), (0, _toConsumableArray2.default)(tile.obb.quaternion));
    var obb = new _culling.OrientedBoundingBox().fromCenterHalfSizeQuaternion(boundingVolume.box.slice(0, 3), tile.obb.halfSize, tile.obb.quaternion);
    var boundingSphere = obb.getBoundingSphere();
    boundingVolume.sphere = [].concat((0, _toConsumableArray2.default)(boundingSphere.center), [boundingSphere.radius]);
    mbs = [].concat((0, _toConsumableArray2.default)(tile.obb.center), [boundingSphere.radius]);
  }
  var lodMetricType = (_tile$lodSelection = tile.lodSelection) === null || _tile$lodSelection === void 0 ? void 0 : _tile$lodSelection[0].metricType;
  var lodMetricValue = (_tile$lodSelection2 = tile.lodSelection) === null || _tile$lodSelection2 === void 0 ? void 0 : _tile$lodSelection2[0].maxError;
  var transformMatrix = tile.transform;
  var type = _tiles.TILE_TYPE.MESH;
  var refine = _tiles.TILE_REFINEMENT.REPLACE;
  return _objectSpread(_objectSpread({}, tile), {}, {
    mbs: mbs,
    boundingVolume: boundingVolume,
    lodMetricType: lodMetricType,
    lodMetricValue: lodMetricValue,
    transformMatrix: transformMatrix,
    type: type,
    refine: refine
  });
}
function normalizeTilesetData(_x, _x2, _x3) {
  return _normalizeTilesetData.apply(this, arguments);
}
function _normalizeTilesetData() {
  _normalizeTilesetData = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(tileset, options, context) {
    var _options$i3s, rootNodeUrl;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          tileset.url = context.url;
          if (!tileset.nodePages) {
            _context.next = 6;
            break;
          }
          tileset.nodePagesTile = new _i3sNodepagesTiles.default(tileset, options);
          tileset.root = tileset.nodePagesTile.formTileFromNodePages(0);
          _context.next = 10;
          break;
        case 6:
          rootNodeUrl = (0, _urlUtils.getUrlWithToken)("".concat(tileset.url, "/nodes/root"), (_options$i3s = options.i3s) === null || _options$i3s === void 0 ? void 0 : _options$i3s.token);
          _context.next = 9;
          return (0, _core.load)(rootNodeUrl, tileset.loader, _objectSpread(_objectSpread({}, options), {}, {
            i3s: _objectSpread(_objectSpread({}, options.i3s), {}, {
              loadContent: false,
              isTileHeader: true,
              isTileset: false
            })
          }));
        case 9:
          tileset.root = _context.sent;
        case 10:
          tileset.basePath = tileset.url;
          tileset.type = _tiles.TILESET_TYPE.I3S;
          tileset.lodMetricType = tileset.root.lodMetricType;
          tileset.lodMetricValue = tileset.root.lodMetricValue;
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _normalizeTilesetData.apply(this, arguments);
}
//# sourceMappingURL=parse-i3s.js.map