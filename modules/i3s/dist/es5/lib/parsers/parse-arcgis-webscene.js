"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseWebscene = parseWebscene;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@loaders.gl/core");
var SUPPORTED_WKID = 4326;
var ARCGIS_SCENE_SERVER_LAYER_TYPE = 'ArcGISSceneServiceLayer';
var BUILDING_SCENE_LAYER = 'BuildingSceneLayer';
var INTEGRATED_MESH_LAYER = 'IntegratedMeshLayer';
var GROUP_LAYER = 'GroupLayer';
var SUPPORTED_LAYERS_TYPES = [ARCGIS_SCENE_SERVER_LAYER_TYPE, INTEGRATED_MESH_LAYER, BUILDING_SCENE_LAYER, GROUP_LAYER];
var NO_AVAILABLE_SUPPORTED_LAYERS_ERROR = 'NO_AVAILABLE_SUPPORTED_LAYERS_ERROR';
var NOT_SUPPORTED_CRS_ERROR = 'NOT_SUPPORTED_CRS_ERROR';
function parseWebscene(_x) {
  return _parseWebscene.apply(this, arguments);
}
function _parseWebscene() {
  _parseWebscene = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var layer0, operationalLayers, _yield$parseOperation, layers, unsupportedLayers;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          layer0 = JSON.parse(new TextDecoder().decode(data));
          operationalLayers = layer0.operationalLayers;
          _context.next = 4;
          return parseOperationalLayers(operationalLayers, true);
        case 4:
          _yield$parseOperation = _context.sent;
          layers = _yield$parseOperation.layers;
          unsupportedLayers = _yield$parseOperation.unsupportedLayers;
          if (layers.length) {
            _context.next = 9;
            break;
          }
          throw new Error(NO_AVAILABLE_SUPPORTED_LAYERS_ERROR);
        case 9:
          return _context.abrupt("return", {
            header: layer0,
            layers: layers,
            unsupportedLayers: unsupportedLayers
          });
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseWebscene.apply(this, arguments);
}
function parseOperationalLayers(_x2, _x3) {
  return _parseOperationalLayers.apply(this, arguments);
}
function _parseOperationalLayers() {
  _parseOperationalLayers = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(layersList, needToCheckCRS) {
    var layers, unsupportedLayers, index, _layer$layers, layer, isLayerSupported, _yield$parseOperation2, childLayers, childUnsupportedLayers;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          layers = [];
          unsupportedLayers = [];
          index = 0;
        case 3:
          if (!(index < layersList.length)) {
            _context2.next = 26;
            break;
          }
          layer = layersList[index];
          isLayerSupported = SUPPORTED_LAYERS_TYPES.includes(layer.layerType);
          if (!isLayerSupported) {
            _context2.next = 14;
            break;
          }
          if (!(needToCheckCRS && layer.layerType !== GROUP_LAYER)) {
            _context2.next = 11;
            break;
          }
          _context2.next = 10;
          return checkSupportedIndexCRS(layer);
        case 10:
          needToCheckCRS = false;
        case 11:
          layers.push(layer);
          _context2.next = 15;
          break;
        case 14:
          unsupportedLayers.push(layer);
        case 15:
          if (!((_layer$layers = layer.layers) !== null && _layer$layers !== void 0 && _layer$layers.length)) {
            _context2.next = 23;
            break;
          }
          _context2.next = 18;
          return parseOperationalLayers(layer.layers, needToCheckCRS);
        case 18:
          _yield$parseOperation2 = _context2.sent;
          childLayers = _yield$parseOperation2.layers;
          childUnsupportedLayers = _yield$parseOperation2.unsupportedLayers;
          layer.layers = childLayers;
          unsupportedLayers = [].concat((0, _toConsumableArray2.default)(unsupportedLayers), (0, _toConsumableArray2.default)(childUnsupportedLayers));
        case 23:
          index++;
          _context2.next = 3;
          break;
        case 26:
          return _context2.abrupt("return", {
            layers: layers,
            unsupportedLayers: unsupportedLayers
          });
        case 27:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _parseOperationalLayers.apply(this, arguments);
}
function checkSupportedIndexCRS(_x4) {
  return _checkSupportedIndexCRS.apply(this, arguments);
}
function _checkSupportedIndexCRS() {
  _checkSupportedIndexCRS = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(layer) {
    var _layerJson$spatialRef, layerJson, wkid;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _core.load)(layer.url, _core.JSONLoader);
        case 3:
          layerJson = _context3.sent;
          wkid = layerJson === null || layerJson === void 0 ? void 0 : (_layerJson$spatialRef = layerJson.spatialReference) === null || _layerJson$spatialRef === void 0 ? void 0 : _layerJson$spatialRef.wkid;
          if (!(wkid !== SUPPORTED_WKID)) {
            _context3.next = 7;
            break;
          }
          throw new Error(NOT_SUPPORTED_CRS_ERROR);
        case 7:
          _context3.next = 12;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          throw _context3.t0;
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return _checkSupportedIndexCRS.apply(this, arguments);
}
//# sourceMappingURL=parse-arcgis-webscene.js.map