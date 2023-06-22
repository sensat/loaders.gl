"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHARED_RESOURCES = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var MATERIAL_DEFINITION_INFO_PARAMS = function MATERIAL_DEFINITION_INFO_PARAMS() {
  return {
    renderMode: {
      path: 'renderMode',
      default: 'solid'
    },
    shininess: {
      path: 'shininess',
      default: 1
    },
    reflectivity: {
      path: 'reflectivity',
      default: 0
    },
    ambient: {
      path: 'ambient',
      default: [1, 1, 1]
    },
    diffuse: {
      path: 'diffuse',
      default: [1, 1, 1]
    },
    specular: {
      path: 'specular',
      default: [0, 0, 0]
    },
    useVertexColorAlpha: {
      path: 'useVertexColorAlpha',
      default: false
    },
    vertexRegions: {
      path: 'vertexRegions',
      default: false
    },
    vertexColors: {
      path: 'vertexColors',
      default: true
    }
  };
};
var MATERIAL_DEFINITION_INFO = function MATERIAL_DEFINITION_INFO() {
  return {
    name: {
      path: 'name',
      default: 'standard'
    },
    type: {
      path: 'type',
      default: 'standard'
    },
    params: {
      path: 'params',
      transform: function transform(val, thisObject, originalObject) {
        return (0, _jsonMapTransform.default)(originalObject, MATERIAL_DEFINITION_INFO_PARAMS());
      }
    }
  };
};
var TEXTURE_DEFINITION_IMAGE = function TEXTURE_DEFINITION_IMAGE() {
  return {
    id: {
      path: 'id'
    },
    size: {
      path: 'size'
    },
    href: {
      path: 'href',
      default: ['../textures/0']
    },
    length: {
      path: 'length'
    }
  };
};
var TEXTURE_DEFINITION_INFO = function TEXTURE_DEFINITION_INFO() {
  return {
    encoding: {
      path: 'encoding'
    },
    wrap: {
      path: 'wrap',
      default: ['none']
    },
    atlas: {
      path: 'atlas',
      default: false
    },
    uvSet: {
      path: 'uvSet',
      default: 'uv0'
    },
    channels: {
      path: 'channels',
      default: 'rgb'
    },
    images: {
      path: 'images',
      transform: function transform(val, thisObject, originalObject) {
        return val.map(function (image) {
          return (0, _jsonMapTransform.default)(image, TEXTURE_DEFINITION_IMAGE());
        });
      }
    }
  };
};
var SHARED_RESOURCES = function SHARED_RESOURCES() {
  return {
    materialDefinitions: {
      path: 'materialDefinitionInfos',
      transform: transfromMaterialDefinitions
    },
    textureDefinitions: {
      path: 'textureDefinitionInfos',
      transform: transfromTextureDefinitions
    }
  };
};
exports.SHARED_RESOURCES = SHARED_RESOURCES;
function transfromMaterialDefinitions(materialDefinitionInfos, thisObject, originalObject) {
  var result = {};
  var _iterator = _createForOfIteratorHelper(materialDefinitionInfos.entries()),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
        index = _step$value[0],
        materialDefinitionInfo = _step$value[1];
      result["Mat".concat(originalObject.nodePath).concat(index)] = (0, _jsonMapTransform.default)(materialDefinitionInfo, MATERIAL_DEFINITION_INFO());
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
}
function transfromTextureDefinitions(textureDefinitionInfos, thisObject, originalObject) {
  if (!textureDefinitionInfos) {
    return null;
  }
  var result = {};
  var _iterator2 = _createForOfIteratorHelper(textureDefinitionInfos.entries()),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
        index = _step2$value[0],
        textureDefinitionInfo = _step2$value[1];
      var imageIndex = "".concat(originalObject.nodePath).concat(index);
      textureDefinitionInfo.imageIndex = imageIndex;
      result[imageIndex] = (0, _jsonMapTransform.default)(textureDefinitionInfo, TEXTURE_DEFINITION_INFO());
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return result;
}
//# sourceMappingURL=shared-resources.js.map