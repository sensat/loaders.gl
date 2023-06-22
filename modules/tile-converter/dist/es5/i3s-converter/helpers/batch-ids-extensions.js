"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleBatchIdsExtensions = handleBatchIdsExtensions;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var EXT_MESH_FEATURES = 'EXT_mesh_features';
var EXT_FEATURE_METADATA = 'EXT_feature_metadata';
function handleBatchIdsExtensions(attributes, primitive, images) {
  var extensions = primitive === null || primitive === void 0 ? void 0 : primitive.extensions;
  if (!extensions) {
    return [];
  }
  for (var _i = 0, _Object$entries = Object.entries(extensions || {}); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
      extensionName = _Object$entries$_i[0],
      extensionData = _Object$entries$_i[1];
    switch (extensionName) {
      case EXT_FEATURE_METADATA:
        return handleExtFeatureMetadataExtension(attributes, extensionData, images);
      case EXT_MESH_FEATURES:
        console.warn('EXT_mesh_features extension is not supported yet');
        return [];
      default:
        return [];
    }
  }
  return [];
}
function handleExtFeatureMetadataExtension(attributes, extFeatureMetadata, images) {
  var _extFeatureMetadata$f, _featureIdAttribute$f, _featureIdAttribute$f2, _featureIdAttribute$f3;
  var featureIdAttribute = extFeatureMetadata === null || extFeatureMetadata === void 0 ? void 0 : (_extFeatureMetadata$f = extFeatureMetadata.featureIdAttributes) === null || _extFeatureMetadata$f === void 0 ? void 0 : _extFeatureMetadata$f[0];
  if (featureIdAttribute !== null && featureIdAttribute !== void 0 && (_featureIdAttribute$f = featureIdAttribute.featureIds) !== null && _featureIdAttribute$f !== void 0 && _featureIdAttribute$f.attribute) {
    var batchIdsAttribute = attributes[featureIdAttribute.featureIds.attribute];
    return batchIdsAttribute.value;
  }
  if (featureIdAttribute !== null && featureIdAttribute !== void 0 && (_featureIdAttribute$f2 = featureIdAttribute.featureIds) !== null && _featureIdAttribute$f2 !== void 0 && _featureIdAttribute$f2.hasOwnProperty('constant') && featureIdAttribute !== null && featureIdAttribute !== void 0 && (_featureIdAttribute$f3 = featureIdAttribute.featureIds) !== null && _featureIdAttribute$f3 !== void 0 && _featureIdAttribute$f3.hasOwnProperty('divisor')) {
    var _attributes$POSITIONS;
    var featuresCount = (attributes === null || attributes === void 0 ? void 0 : (_attributes$POSITIONS = attributes.POSITIONS) === null || _attributes$POSITIONS === void 0 ? void 0 : _attributes$POSITIONS.value.length) / 3 || 0;
    return generateImplicitFeatureIds(featuresCount, featureIdAttribute.featureIds.constant, featureIdAttribute.featureIds.divisor);
  }
  var featureIdTexture = (extFeatureMetadata === null || extFeatureMetadata === void 0 ? void 0 : extFeatureMetadata.featureIdTextures) && (extFeatureMetadata === null || extFeatureMetadata === void 0 ? void 0 : extFeatureMetadata.featureIdTextures[0]);
  if (featureIdTexture) {
    var _featureIdTexture$fea, _featureIdTexture$fea2;
    var textureAttributeIndex = (featureIdTexture === null || featureIdTexture === void 0 ? void 0 : (_featureIdTexture$fea = featureIdTexture.featureIds) === null || _featureIdTexture$fea === void 0 ? void 0 : (_featureIdTexture$fea2 = _featureIdTexture$fea.texture) === null || _featureIdTexture$fea2 === void 0 ? void 0 : _featureIdTexture$fea2.texCoord) || 0;
    var textCoordAttribute = "TEXCOORD_".concat(textureAttributeIndex);
    var textureCoordinates = attributes[textCoordAttribute].value;
    return generateBatchIdsFromTexture(featureIdTexture, textureCoordinates, images);
  }
  var featureTexture = (extFeatureMetadata === null || extFeatureMetadata === void 0 ? void 0 : extFeatureMetadata.featureTextures) && (extFeatureMetadata === null || extFeatureMetadata === void 0 ? void 0 : extFeatureMetadata.featureTextures[0]);
  if (featureTexture) {
    console.warn("EXT_feature_metadata doesn't yet support featureTextures in primitive");
    return [];
  }
  return [];
}
function generateImplicitFeatureIds(featuresCount) {
  var constant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var divisor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var featureIds = [];
  if (divisor > 0) {
    var currentValue = constant;
    var devisorCounter = divisor;
    for (var index = 0; index < featuresCount; index++) {
      featureIds.push(currentValue);
      devisorCounter -= 1;
      if (devisorCounter === 0) {
        currentValue++;
        devisorCounter = divisor;
      }
    }
  } else {
    featureIds = Array(featuresCount).fill(constant, 0, featuresCount);
  }
  return featureIds;
}
function generateBatchIdsFromTexture(featureIdTexture, textureCoordinates, images) {
  var _featureIdTexture$fea3, _featureIdTexture$fea4, _featureIdTexture$fea5;
  if (!(images !== null && images !== void 0 && images.length)) {
    return [];
  }
  var CHANNELS_MAP = {
    r: 0,
    g: 1,
    b: 2,
    a: 3
  };
  var textureIndex = featureIdTexture === null || featureIdTexture === void 0 ? void 0 : (_featureIdTexture$fea3 = featureIdTexture.featureIds) === null || _featureIdTexture$fea3 === void 0 ? void 0 : (_featureIdTexture$fea4 = _featureIdTexture$fea3.texture) === null || _featureIdTexture$fea4 === void 0 ? void 0 : _featureIdTexture$fea4.index;
  var featureChannel = featureIdTexture === null || featureIdTexture === void 0 ? void 0 : (_featureIdTexture$fea5 = featureIdTexture.featureIds) === null || _featureIdTexture$fea5 === void 0 ? void 0 : _featureIdTexture$fea5.channels;
  if (!featureChannel || textureIndex === undefined) {
    return [];
  }
  var image = images[textureIndex];
  var batchIds = [];
  var channels = CHANNELS_MAP[featureChannel];
  if (image && image !== null && image !== void 0 && image.width && image !== null && image !== void 0 && image.height && image !== null && image !== void 0 && image.components) {
    for (var index = 0; index < textureCoordinates.length; index += 2) {
      var u = textureCoordinates[index];
      var v = textureCoordinates[index + 1];
      var tx = Math.min(emod(u) * image.width | 0, image.width - 1);
      var ty = Math.min(emod(v) * image.height | 0, image.height - 1);
      var offset = (ty * image.width + tx) * image.components + channels;
      var batchId = new Uint8Array(image.data)[offset];
      batchIds.push(batchId);
    }
  } else {
    console.warn("Can't get batch Ids from ".concat((image === null || image === void 0 ? void 0 : image.mimeType) || '', " compressed texture"));
  }
  return batchIds;
}
function emod(n) {
  return (n % 1 + 1) % 1;
}
//# sourceMappingURL=batch-ids-extensions.js.map