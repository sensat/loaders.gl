"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBuildingSceneLayer = parseBuildingSceneLayer;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _excluded = ["id", "layerType", "visibility"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var OBJECT_3D_LAYER_TYPE = '3DObject';
function parseBuildingSceneLayer(_x, _x2) {
  return _parseBuildingSceneLayer.apply(this, arguments);
}
function _parseBuildingSceneLayer() {
  _parseBuildingSceneLayer = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data, url) {
    var layer0, sublayers;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          layer0 = JSON.parse(new TextDecoder().decode(data));
          sublayers = layer0.sublayers;
          return _context.abrupt("return", {
            header: layer0,
            sublayers: parseSublayersTree(sublayers, url)
          });
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseBuildingSceneLayer.apply(this, arguments);
}
function parseSublayersTree(sublayers, url) {
  var layers = [];
  for (var index = 0; index < sublayers.length; index++) {
    var _subLayer$sublayers;
    var subLayer = sublayers[index];
    var id = subLayer.id,
      layerType = subLayer.layerType,
      _subLayer$visibility = subLayer.visibility,
      visibility = _subLayer$visibility === void 0 ? true : _subLayer$visibility,
      rest = (0, _objectWithoutProperties2.default)(subLayer, _excluded);
    if (layerType === OBJECT_3D_LAYER_TYPE) {
      var sublayerUrl = "".concat(url, "/sublayers/").concat(id);
      layers.push(_objectSpread({
        url: sublayerUrl,
        id: id,
        layerType: layerType,
        visibility: visibility
      }, rest));
    }
    if (subLayer !== null && subLayer !== void 0 && (_subLayer$sublayers = subLayer.sublayers) !== null && _subLayer$sublayers !== void 0 && _subLayer$sublayers.length) {
      layers = [].concat((0, _toConsumableArray2.default)(layers), (0, _toConsumableArray2.default)(parseSublayersTree(subLayer.sublayers, url)));
    }
  }
  return layers;
}
//# sourceMappingURL=parse-i3s-building-scene-layer.js.map