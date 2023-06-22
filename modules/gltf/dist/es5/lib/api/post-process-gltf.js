"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postProcessGLTF = postProcessGLTF;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _assert = require("../utils/assert");
var _gltfUtils = require("../gltf-utils/gltf-utils");
var _DEFAULT_SAMPLER_PARA;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var COMPONENTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
var BYTES = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
};
var GL_SAMPLER = {
  TEXTURE_MAG_FILTER: 0x2800,
  TEXTURE_MIN_FILTER: 0x2801,
  TEXTURE_WRAP_S: 0x2802,
  TEXTURE_WRAP_T: 0x2803,
  REPEAT: 0x2901,
  LINEAR: 0x2601,
  NEAREST_MIPMAP_LINEAR: 0x2702
};
var SAMPLER_PARAMETER_GLTF_TO_GL = {
  magFilter: GL_SAMPLER.TEXTURE_MAG_FILTER,
  minFilter: GL_SAMPLER.TEXTURE_MIN_FILTER,
  wrapS: GL_SAMPLER.TEXTURE_WRAP_S,
  wrapT: GL_SAMPLER.TEXTURE_WRAP_T
};
var DEFAULT_SAMPLER_PARAMETERS = (_DEFAULT_SAMPLER_PARA = {}, (0, _defineProperty2.default)(_DEFAULT_SAMPLER_PARA, GL_SAMPLER.TEXTURE_MAG_FILTER, GL_SAMPLER.LINEAR), (0, _defineProperty2.default)(_DEFAULT_SAMPLER_PARA, GL_SAMPLER.TEXTURE_MIN_FILTER, GL_SAMPLER.NEAREST_MIPMAP_LINEAR), (0, _defineProperty2.default)(_DEFAULT_SAMPLER_PARA, GL_SAMPLER.TEXTURE_WRAP_S, GL_SAMPLER.REPEAT), (0, _defineProperty2.default)(_DEFAULT_SAMPLER_PARA, GL_SAMPLER.TEXTURE_WRAP_T, GL_SAMPLER.REPEAT), _DEFAULT_SAMPLER_PARA);
function makeDefaultSampler() {
  return {
    id: 'default-sampler',
    parameters: DEFAULT_SAMPLER_PARAMETERS
  };
}
function getBytesFromComponentType(componentType) {
  return BYTES[componentType];
}
function getSizeFromAccessorType(type) {
  return COMPONENTS[type];
}
var GLTFPostProcessor = function () {
  function GLTFPostProcessor() {
    (0, _classCallCheck2.default)(this, GLTFPostProcessor);
    (0, _defineProperty2.default)(this, "baseUri", '');
    (0, _defineProperty2.default)(this, "jsonUnprocessed", void 0);
    (0, _defineProperty2.default)(this, "json", void 0);
    (0, _defineProperty2.default)(this, "buffers", []);
    (0, _defineProperty2.default)(this, "images", []);
  }
  (0, _createClass2.default)(GLTFPostProcessor, [{
    key: "postProcess",
    value: function postProcess(gltf) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var json = gltf.json,
        _gltf$buffers = gltf.buffers,
        buffers = _gltf$buffers === void 0 ? [] : _gltf$buffers,
        _gltf$images = gltf.images,
        images = _gltf$images === void 0 ? [] : _gltf$images;
      var _gltf$baseUri = gltf.baseUri,
        baseUri = _gltf$baseUri === void 0 ? '' : _gltf$baseUri;
      (0, _assert.assert)(json);
      this.baseUri = baseUri;
      this.buffers = buffers;
      this.images = images;
      this.jsonUnprocessed = json;
      this.json = this._resolveTree(gltf.json, options);
      return this.json;
    }
  }, {
    key: "_resolveTree",
    value: function _resolveTree(gltf) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var json = _objectSpread({}, gltf);
      this.json = json;
      if (gltf.bufferViews) {
        json.bufferViews = gltf.bufferViews.map(function (bufView, i) {
          return _this._resolveBufferView(bufView, i);
        });
      }
      if (gltf.images) {
        json.images = gltf.images.map(function (image, i) {
          return _this._resolveImage(image, i);
        });
      }
      if (gltf.samplers) {
        json.samplers = gltf.samplers.map(function (sampler, i) {
          return _this._resolveSampler(sampler, i);
        });
      }
      if (gltf.textures) {
        json.textures = gltf.textures.map(function (texture, i) {
          return _this._resolveTexture(texture, i);
        });
      }
      if (gltf.accessors) {
        json.accessors = gltf.accessors.map(function (accessor, i) {
          return _this._resolveAccessor(accessor, i);
        });
      }
      if (gltf.materials) {
        json.materials = gltf.materials.map(function (material, i) {
          return _this._resolveMaterial(material, i);
        });
      }
      if (gltf.meshes) {
        json.meshes = gltf.meshes.map(function (mesh, i) {
          return _this._resolveMesh(mesh, i);
        });
      }
      if (gltf.nodes) {
        json.nodes = gltf.nodes.map(function (node, i) {
          return _this._resolveNode(node, i);
        });
        json.nodes = json.nodes.map(function (node, i) {
          return _this._resolveNodeChildren(node);
        });
      }
      if (gltf.skins) {
        json.skins = gltf.skins.map(function (skin, i) {
          return _this._resolveSkin(skin, i);
        });
      }
      if (gltf.scenes) {
        json.scenes = gltf.scenes.map(function (scene, i) {
          return _this._resolveScene(scene, i);
        });
      }
      if (typeof this.json.scene === 'number' && json.scenes) {
        json.scene = json.scenes[this.json.scene];
      }
      return json;
    }
  }, {
    key: "getScene",
    value: function getScene(index) {
      return this._get(this.json.scenes, index);
    }
  }, {
    key: "getNode",
    value: function getNode(index) {
      return this._get(this.json.nodes, index);
    }
  }, {
    key: "getSkin",
    value: function getSkin(index) {
      return this._get(this.json.skins, index);
    }
  }, {
    key: "getMesh",
    value: function getMesh(index) {
      return this._get(this.json.meshes, index);
    }
  }, {
    key: "getMaterial",
    value: function getMaterial(index) {
      return this._get(this.json.materials, index);
    }
  }, {
    key: "getAccessor",
    value: function getAccessor(index) {
      return this._get(this.json.accessors, index);
    }
  }, {
    key: "getCamera",
    value: function getCamera(index) {
      return this._get(this.json.cameras, index);
    }
  }, {
    key: "getTexture",
    value: function getTexture(index) {
      return this._get(this.json.textures, index);
    }
  }, {
    key: "getSampler",
    value: function getSampler(index) {
      return this._get(this.json.samplers, index);
    }
  }, {
    key: "getImage",
    value: function getImage(index) {
      return this._get(this.json.images, index);
    }
  }, {
    key: "getBufferView",
    value: function getBufferView(index) {
      return this._get(this.json.bufferViews, index);
    }
  }, {
    key: "getBuffer",
    value: function getBuffer(index) {
      return this._get(this.json.buffers, index);
    }
  }, {
    key: "_get",
    value: function _get(array, index) {
      if ((0, _typeof2.default)(index) === 'object') {
        return index;
      }
      var object = array && array[index];
      if (!object) {
        console.warn("glTF file error: Could not find ".concat(array, "[").concat(index, "]"));
      }
      return object;
    }
  }, {
    key: "_resolveScene",
    value: function _resolveScene(scene, index) {
      var _this2 = this;
      return _objectSpread(_objectSpread({}, scene), {}, {
        id: scene.id || "scene-".concat(index),
        nodes: (scene.nodes || []).map(function (node) {
          return _this2.getNode(node);
        })
      });
    }
  }, {
    key: "_resolveNode",
    value: function _resolveNode(gltfNode, index) {
      var _this3 = this;
      var node = _objectSpread(_objectSpread({}, gltfNode), {}, {
        id: (gltfNode === null || gltfNode === void 0 ? void 0 : gltfNode.id) || "node-".concat(index)
      });
      if (gltfNode.mesh !== undefined) {
        node.mesh = this.getMesh(gltfNode.mesh);
      }
      if (gltfNode.camera !== undefined) {
        node.camera = this.getCamera(gltfNode.camera);
      }
      if (gltfNode.skin !== undefined) {
        node.skin = this.getSkin(gltfNode.skin);
      }
      if (gltfNode.meshes !== undefined && gltfNode.meshes.length) {
        node.mesh = gltfNode.meshes.reduce(function (accum, meshIndex) {
          var mesh = _this3.getMesh(meshIndex);
          accum.id = mesh.id;
          accum.primitives = accum.primitives.concat(mesh.primitives);
          return accum;
        }, {
          primitives: []
        });
      }
      return node;
    }
  }, {
    key: "_resolveNodeChildren",
    value: function _resolveNodeChildren(node) {
      var _this4 = this;
      if (node.children) {
        node.children = node.children.map(function (child) {
          return _this4.getNode(child);
        });
      }
      return node;
    }
  }, {
    key: "_resolveSkin",
    value: function _resolveSkin(gltfSkin, index) {
      var inverseBindMatrices = typeof gltfSkin.inverseBindMatrices === 'number' ? this.getAccessor(gltfSkin.inverseBindMatrices) : undefined;
      return _objectSpread(_objectSpread({}, gltfSkin), {}, {
        id: gltfSkin.id || "skin-".concat(index),
        inverseBindMatrices: inverseBindMatrices
      });
    }
  }, {
    key: "_resolveMesh",
    value: function _resolveMesh(gltfMesh, index) {
      var _this5 = this;
      var mesh = _objectSpread(_objectSpread({}, gltfMesh), {}, {
        id: gltfMesh.id || "mesh-".concat(index),
        primitives: []
      });
      if (gltfMesh.primitives) {
        mesh.primitives = gltfMesh.primitives.map(function (gltfPrimitive) {
          var primitive = _objectSpread(_objectSpread({}, gltfPrimitive), {}, {
            attributes: {},
            indices: undefined,
            material: undefined
          });
          var attributes = gltfPrimitive.attributes;
          for (var attribute in attributes) {
            primitive.attributes[attribute] = _this5.getAccessor(attributes[attribute]);
          }
          if (gltfPrimitive.indices !== undefined) {
            primitive.indices = _this5.getAccessor(gltfPrimitive.indices);
          }
          if (gltfPrimitive.material !== undefined) {
            primitive.material = _this5.getMaterial(gltfPrimitive.material);
          }
          return primitive;
        });
      }
      return mesh;
    }
  }, {
    key: "_resolveMaterial",
    value: function _resolveMaterial(gltfMaterial, index) {
      var material = _objectSpread(_objectSpread({}, gltfMaterial), {}, {
        id: gltfMaterial.id || "material-".concat(index)
      });
      if (material.normalTexture) {
        material.normalTexture = _objectSpread({}, material.normalTexture);
        material.normalTexture.texture = this.getTexture(material.normalTexture.index);
      }
      if (material.occlusionTexture) {
        material.occlusionTexture = _objectSpread({}, material.occlusionTexture);
        material.occlusionTexture.texture = this.getTexture(material.occlusionTexture.index);
      }
      if (material.emissiveTexture) {
        material.emissiveTexture = _objectSpread({}, material.emissiveTexture);
        material.emissiveTexture.texture = this.getTexture(material.emissiveTexture.index);
      }
      if (!material.emissiveFactor) {
        material.emissiveFactor = material.emissiveTexture ? [1, 1, 1] : [0, 0, 0];
      }
      if (material.pbrMetallicRoughness) {
        material.pbrMetallicRoughness = _objectSpread({}, material.pbrMetallicRoughness);
        var mr = material.pbrMetallicRoughness;
        if (mr.baseColorTexture) {
          mr.baseColorTexture = _objectSpread({}, mr.baseColorTexture);
          mr.baseColorTexture.texture = this.getTexture(mr.baseColorTexture.index);
        }
        if (mr.metallicRoughnessTexture) {
          mr.metallicRoughnessTexture = _objectSpread({}, mr.metallicRoughnessTexture);
          mr.metallicRoughnessTexture.texture = this.getTexture(mr.metallicRoughnessTexture.index);
        }
      }
      return material;
    }
  }, {
    key: "_resolveAccessor",
    value: function _resolveAccessor(gltfAccessor, index) {
      var bytesPerComponent = getBytesFromComponentType(gltfAccessor.componentType);
      var components = getSizeFromAccessorType(gltfAccessor.type);
      var bytesPerElement = bytesPerComponent * components;
      var accessor = _objectSpread(_objectSpread({}, gltfAccessor), {}, {
        id: gltfAccessor.id || "accessor-".concat(index),
        bytesPerComponent: bytesPerComponent,
        components: components,
        bytesPerElement: bytesPerElement,
        value: undefined,
        bufferView: undefined,
        sparse: undefined
      });
      if (gltfAccessor.bufferView !== undefined) {
        accessor.bufferView = this.getBufferView(gltfAccessor.bufferView);
      }
      if (accessor.bufferView) {
        var buffer = accessor.bufferView.buffer;
        var _getAccessorArrayType = (0, _gltfUtils.getAccessorArrayTypeAndLength)(accessor, accessor.bufferView),
          ArrayType = _getAccessorArrayType.ArrayType,
          byteLength = _getAccessorArrayType.byteLength;
        var byteOffset = (accessor.bufferView.byteOffset || 0) + (accessor.byteOffset || 0) + buffer.byteOffset;
        var cutBuffer = buffer.arrayBuffer.slice(byteOffset, byteOffset + byteLength);
        if (accessor.bufferView.byteStride) {
          cutBuffer = this._getValueFromInterleavedBuffer(buffer, byteOffset, accessor.bufferView.byteStride, accessor.bytesPerElement, accessor.count);
        }
        accessor.value = new ArrayType(cutBuffer);
      }
      return accessor;
    }
  }, {
    key: "_getValueFromInterleavedBuffer",
    value: function _getValueFromInterleavedBuffer(buffer, byteOffset, byteStride, bytesPerElement, count) {
      var result = new Uint8Array(count * bytesPerElement);
      for (var i = 0; i < count; i++) {
        var elementOffset = byteOffset + i * byteStride;
        result.set(new Uint8Array(buffer.arrayBuffer.slice(elementOffset, elementOffset + bytesPerElement)), i * bytesPerElement);
      }
      return result.buffer;
    }
  }, {
    key: "_resolveTexture",
    value: function _resolveTexture(gltfTexture, index) {
      return _objectSpread(_objectSpread({}, gltfTexture), {}, {
        id: gltfTexture.id || "texture-".concat(index),
        sampler: typeof gltfTexture.sampler === 'number' ? this.getSampler(gltfTexture.sampler) : makeDefaultSampler(),
        source: typeof gltfTexture.source === 'number' ? this.getImage(gltfTexture.source) : undefined
      });
    }
  }, {
    key: "_resolveSampler",
    value: function _resolveSampler(gltfSampler, index) {
      var sampler = _objectSpread(_objectSpread({
        id: gltfSampler.id || "sampler-".concat(index)
      }, gltfSampler), {}, {
        parameters: {}
      });
      for (var key in sampler) {
        var glEnum = this._enumSamplerParameter(key);
        if (glEnum !== undefined) {
          sampler.parameters[glEnum] = sampler[key];
        }
      }
      return sampler;
    }
  }, {
    key: "_enumSamplerParameter",
    value: function _enumSamplerParameter(key) {
      return SAMPLER_PARAMETER_GLTF_TO_GL[key];
    }
  }, {
    key: "_resolveImage",
    value: function _resolveImage(gltfImage, index) {
      var image = _objectSpread(_objectSpread({}, gltfImage), {}, {
        id: gltfImage.id || "image-".concat(index),
        image: null,
        bufferView: gltfImage.bufferView !== undefined ? this.getBufferView(gltfImage.bufferView) : undefined
      });
      var preloadedImage = this.images[index];
      if (preloadedImage) {
        image.image = preloadedImage;
      }
      return image;
    }
  }, {
    key: "_resolveBufferView",
    value: function _resolveBufferView(gltfBufferView, index) {
      var bufferIndex = gltfBufferView.buffer;
      var arrayBuffer = this.buffers[bufferIndex].arrayBuffer;
      var byteOffset = this.buffers[bufferIndex].byteOffset || 0;
      if (gltfBufferView.byteOffset) {
        byteOffset += gltfBufferView.byteOffset;
      }
      var bufferView = _objectSpread(_objectSpread({
        id: "bufferView-".concat(index)
      }, gltfBufferView), {}, {
        buffer: this.buffers[bufferIndex],
        data: new Uint8Array(arrayBuffer, byteOffset, gltfBufferView.byteLength)
      });
      return bufferView;
    }
  }, {
    key: "_resolveCamera",
    value: function _resolveCamera(gltfCamera, index) {
      var camera = _objectSpread(_objectSpread({}, gltfCamera), {}, {
        id: gltfCamera.id || "camera-".concat(index)
      });
      if (camera.perspective) {}
      if (camera.orthographic) {}
      return camera;
    }
  }]);
  return GLTFPostProcessor;
}();
function postProcessGLTF(gltf, options) {
  return new GLTFPostProcessor().postProcess(gltf, options);
}
//# sourceMappingURL=post-process-gltf.js.map