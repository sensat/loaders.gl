"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareDataForAttributesConversion = prepareDataForAttributesConversion;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function getB3DMAttributesWithoutBufferView(attributes) {
  var attributesWithoutBufferView = {};
  for (var attributeName in attributes) {
    attributesWithoutBufferView[attributeName] = {
      value: attributes[attributeName].value
    };
  }
  return attributesWithoutBufferView;
}
function prepareDataForAttributesConversion(tileContent) {
  var _tileContent$gltf, _tileContent$gltf$sce, _tileContent$gltf2, _tileContent$gltf2$sc, _tileContent$gltf2$sc2, _tileContent$gltf3, _tileContent$gltf4, _tileContent$gltf4$im;
  var nodes = ((_tileContent$gltf = tileContent.gltf) === null || _tileContent$gltf === void 0 ? void 0 : (_tileContent$gltf$sce = _tileContent$gltf.scene) === null || _tileContent$gltf$sce === void 0 ? void 0 : _tileContent$gltf$sce.nodes) || ((_tileContent$gltf2 = tileContent.gltf) === null || _tileContent$gltf2 === void 0 ? void 0 : (_tileContent$gltf2$sc = _tileContent$gltf2.scenes) === null || _tileContent$gltf2$sc === void 0 ? void 0 : (_tileContent$gltf2$sc2 = _tileContent$gltf2$sc[0]) === null || _tileContent$gltf2$sc2 === void 0 ? void 0 : _tileContent$gltf2$sc2.nodes) || ((_tileContent$gltf3 = tileContent.gltf) === null || _tileContent$gltf3 === void 0 ? void 0 : _tileContent$gltf3.nodes) || [];
  var images = ((_tileContent$gltf4 = tileContent.gltf) === null || _tileContent$gltf4 === void 0 ? void 0 : (_tileContent$gltf4$im = _tileContent$gltf4.images) === null || _tileContent$gltf4$im === void 0 ? void 0 : _tileContent$gltf4$im.map(function (imageObject) {
    var _imageObject$image;
    if (imageObject !== null && imageObject !== void 0 && (_imageObject$image = imageObject.image) !== null && _imageObject$image !== void 0 && _imageObject$image.compressed) {
      return null;
    } else {
      var _imageObject$image2;
      var data = imageObject === null || imageObject === void 0 ? void 0 : (_imageObject$image2 = imageObject.image) === null || _imageObject$image2 === void 0 ? void 0 : _imageObject$image2.data;
      var dataCopy = new Uint8Array(data.length);
      dataCopy.set(data);
      return {
        data: dataCopy,
        compressed: false,
        height: imageObject.image.height,
        width: imageObject.image.width,
        components: imageObject.image.components,
        mimeType: imageObject.mimeType
      };
    }
  })) || [];
  prepareNodes(nodes);
  var cartographicOrigin = tileContent.cartographicOrigin;
  var cartesianModelMatrix = tileContent.cartesianModelMatrix;
  return {
    nodes: nodes,
    images: images,
    cartographicOrigin: cartographicOrigin,
    cartesianModelMatrix: cartesianModelMatrix
  };
}
function prepareNodes(nodes) {
  for (var index = 0; index < nodes.length; index++) {
    var node = nodes[index];
    if (node.mesh) {
      var _node$mesh;
      nodes[index] = _objectSpread(_objectSpread({}, node), {}, {
        mesh: _objectSpread(_objectSpread({}, node.mesh), {}, {
          primitives: (_node$mesh = node.mesh) === null || _node$mesh === void 0 ? void 0 : _node$mesh.primitives.map(function (primitive) {
            var _primitive$indices, _primitive$material, _primitive$material2;
            return _objectSpread(_objectSpread({}, primitive), {}, {
              indices: {
                value: primitive === null || primitive === void 0 ? void 0 : (_primitive$indices = primitive.indices) === null || _primitive$indices === void 0 ? void 0 : _primitive$indices.value
              },
              attributes: getB3DMAttributesWithoutBufferView(primitive.attributes),
              material: {
                id: primitive === null || primitive === void 0 ? void 0 : (_primitive$material = primitive.material) === null || _primitive$material === void 0 ? void 0 : _primitive$material.id,
                uniqueId: primitive === null || primitive === void 0 ? void 0 : (_primitive$material2 = primitive.material) === null || _primitive$material2 === void 0 ? void 0 : _primitive$material2.uniqueId
              }
            });
          })
        })
      });
    }
    if (node.children) {
      prepareNodes(node.children);
    }
  }
}
//# sourceMappingURL=gltf-attributes.js.map