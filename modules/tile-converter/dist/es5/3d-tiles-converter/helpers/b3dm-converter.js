"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _core = require("@loaders.gl/core");
var _gltf = require("@loaders.gl/gltf");
var _dTiles = require("@loaders.gl/3d-tiles");
var _core2 = require("@math.gl/core");
var _geospatial = require("@math.gl/geospatial");
var _textureAtlas = require("./texture-atlas");
var _geometryUtils = require("../../lib/utils/geometry-utils");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Z_UP_TO_Y_UP_MATRIX = new _core2.Matrix4([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
var scratchVector = new _core2.Vector3();
var B3dmConverter = function () {
  function B3dmConverter() {
    (0, _classCallCheck2.default)(this, B3dmConverter);
    (0, _defineProperty2.default)(this, "rtcCenter", void 0);
    (0, _defineProperty2.default)(this, "i3sTile", void 0);
  }
  (0, _createClass2.default)(B3dmConverter, [{
    key: "convert",
    value: function () {
      var _convert = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(i3sAttributesData) {
        var featureAttributes,
          gltf,
          b3dm,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              featureAttributes = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
              _context.next = 3;
              return this.buildGltf(i3sAttributesData, featureAttributes);
            case 3:
              gltf = _context.sent;
              b3dm = (0, _core.encodeSync)({
                gltfEncoded: new Uint8Array(gltf),
                type: 'b3dm',
                featuresLength: this._getFeaturesLength(featureAttributes),
                batchTable: featureAttributes
              }, _dTiles.Tile3DWriter);
              return _context.abrupt("return", b3dm);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function convert(_x) {
        return _convert.apply(this, arguments);
      }
      return convert;
    }()
  }, {
    key: "buildGltf",
    value: function () {
      var _buildGltf = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(i3sAttributesData, featureAttributes) {
        var tileContent, textureFormat, material, attributes, originalIndices, cartesianOrigin, cartographicOrigin, modelMatrix, gltfBuilder, textureIndex, pbrMaterialInfo, materialIndex, positions, positionsValue, indices, meshIndex, transformMatrix, nodeIndex, sceneIndex, gltfBuffer;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              tileContent = i3sAttributesData.tileContent, textureFormat = i3sAttributesData.textureFormat;
              material = tileContent.material, attributes = tileContent.attributes, originalIndices = tileContent.indices, cartesianOrigin = tileContent.cartesianOrigin, cartographicOrigin = tileContent.cartographicOrigin, modelMatrix = tileContent.modelMatrix;
              gltfBuilder = new _gltf.GLTFScenegraph();
              _context2.next = 5;
              return this._addI3sTextureToGltf(tileContent, textureFormat, gltfBuilder);
            case 5:
              textureIndex = _context2.sent;
              pbrMaterialInfo = this._convertI3sMaterialToGltfMaterial(material, textureIndex);
              materialIndex = gltfBuilder.addMaterial(pbrMaterialInfo);
              positions = attributes.positions;
              positionsValue = positions.value;
              if (attributes.uvRegions && attributes.texCoords) {
                attributes.texCoords.value = (0, _textureAtlas.convertTextureAtlas)(attributes.texCoords.value, attributes.uvRegions.value);
              }
              attributes.positions.value = this._normalizePositions(positionsValue, cartesianOrigin, cartographicOrigin, modelMatrix);
              this._createBatchIds(tileContent, featureAttributes);
              if (attributes.normals && !this._checkNormals(attributes.normals.value)) {
                delete attributes.normals;
              }
              indices = originalIndices || (0, _geometryUtils.generateSyntheticIndices)(positionsValue.length / positions.size);
              meshIndex = gltfBuilder.addMesh({
                attributes: attributes,
                indices: indices,
                material: materialIndex,
                mode: 4
              });
              transformMatrix = this._generateTransformMatrix(cartesianOrigin);
              nodeIndex = gltfBuilder.addNode({
                meshIndex: meshIndex,
                matrix: transformMatrix
              });
              sceneIndex = gltfBuilder.addScene({
                nodeIndices: [nodeIndex]
              });
              gltfBuilder.setDefaultScene(sceneIndex);
              gltfBuilder.createBinaryChunk();
              gltfBuffer = (0, _core.encodeSync)(gltfBuilder.gltf, _gltf.GLTFWriter);
              return _context2.abrupt("return", gltfBuffer);
            case 23:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function buildGltf(_x2, _x3) {
        return _buildGltf.apply(this, arguments);
      }
      return buildGltf;
    }()
  }, {
    key: "_addI3sTextureToGltf",
    value: function () {
      var _addI3sTextureToGltf2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(tileContent, textureFormat, gltfBuilder) {
        var texture, material, attributes, textureIndex, selectedTexture, mimeType, imageIndex;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              texture = tileContent.texture, material = tileContent.material, attributes = tileContent.attributes;
              textureIndex = null;
              selectedTexture = texture;
              if (!texture && material) {
                selectedTexture = material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture && material.pbrMetallicRoughness.baseColorTexture.texture.source.image;
              }
              if (selectedTexture) {
                mimeType = this._deduceMimeTypeFromFormat(textureFormat);
                imageIndex = gltfBuilder.addImage(selectedTexture, mimeType);
                textureIndex = gltfBuilder.addTexture({
                  imageIndex: imageIndex
                });
                delete attributes.colors;
              }
              return _context3.abrupt("return", textureIndex);
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function _addI3sTextureToGltf(_x4, _x5, _x6) {
        return _addI3sTextureToGltf2.apply(this, arguments);
      }
      return _addI3sTextureToGltf;
    }()
  }, {
    key: "_normalizePositions",
    value: function _normalizePositions(positionsValue, cartesianOrigin, cartographicOrigin, modelMatrix) {
      var newPositionsValue = new Float32Array(positionsValue.length);
      for (var index = 0; index < positionsValue.length; index += 3) {
        var vertex = positionsValue.subarray(index, index + 3);
        var cartesianOriginVector = new _core2.Vector3(cartesianOrigin);
        var vertexVector = new _core2.Vector3(Array.from(vertex)).transform(modelMatrix).add(cartographicOrigin);
        _geospatial.Ellipsoid.WGS84.cartographicToCartesian(vertexVector, scratchVector);
        vertexVector = scratchVector.subtract(cartesianOriginVector);
        newPositionsValue.set(vertexVector, index);
      }
      return newPositionsValue;
    }
  }, {
    key: "_generateTransformMatrix",
    value: function _generateTransformMatrix(cartesianOrigin) {
      var translateOriginMatrix = new _core2.Matrix4().translate(cartesianOrigin);
      var result = translateOriginMatrix.multiplyLeft(Z_UP_TO_Y_UP_MATRIX);
      return result;
    }
  }, {
    key: "_createBatchIds",
    value: function _createBatchIds(i3sContent, featureAttributes) {
      var featureIds = i3sContent.featureIds;
      var _ref = featureAttributes || {},
        objectIds = _ref.OBJECTID;
      if (!featureIds || !objectIds) {
        return;
      }
      for (var i = 0; i < featureIds.length; i++) {
        var featureId = featureIds[i];
        var batchId = objectIds.indexOf(featureId);
        featureIds[i] = batchId;
      }
      i3sContent.attributes._BATCHID = {
        size: 1,
        byteOffset: 0,
        value: featureIds
      };
    }
  }, {
    key: "_deduceMimeTypeFromFormat",
    value: function _deduceMimeTypeFromFormat(format) {
      switch (format) {
        case 'jpg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'ktx2':
          return 'image/ktx2';
        default:
          console.warn("Unexpected texture format in I3S: ".concat(format));
          return 'image/jpeg';
      }
    }
  }, {
    key: "_convertI3sMaterialToGltfMaterial",
    value: function _convertI3sMaterialToGltfMaterial(material, textureIndex) {
      var isTextureIndexExists = textureIndex !== null;
      if (!material) {
        material = {
          alphaMode: 'OPAQUE',
          doubleSided: false,
          pbrMetallicRoughness: {
            metallicFactor: 0,
            roughnessFactor: 1
          }
        };
        if (isTextureIndexExists) {
          material.pbrMetallicRoughness.baseColorTexture = {
            index: textureIndex,
            texCoord: 0
          };
        } else {
          material.pbrMetallicRoughness.baseColorFactor = [1, 1, 1, 1];
        }
        return material;
      }
      if (textureIndex !== null) {
        material = this._setGltfTexture(material, textureIndex);
      }
      return material;
    }
  }, {
    key: "_setGltfTexture",
    value: function _setGltfTexture(materialDefinition, textureIndex) {
      var material = _objectSpread(_objectSpread({}, materialDefinition), {}, {
        pbrMetallicRoughness: _objectSpread({}, materialDefinition.pbrMetallicRoughness)
      });
      if (materialDefinition.pbrMetallicRoughness && materialDefinition.pbrMetallicRoughness.baseColorTexture) {
        material.pbrMetallicRoughness.baseColorTexture = {
          index: textureIndex,
          texCoord: 0
        };
      } else if (materialDefinition.emissiveTexture) {
        material.emissiveTexture = {
          index: textureIndex,
          texCoord: 0
        };
      } else if (materialDefinition.pbrMetallicRoughness && materialDefinition.pbrMetallicRoughness.metallicRoughnessTexture) {
        material.pbrMetallicRoughness.metallicRoughnessTexture = {
          index: textureIndex,
          texCoord: 0
        };
      } else if (materialDefinition.normalTexture) {
        material.normalTexture = {
          index: textureIndex,
          texCoord: 0
        };
      } else if (materialDefinition.occlusionTexture) {
        material.occlusionTexture = {
          index: textureIndex,
          texCoord: 0
        };
      }
      return material;
    }
  }, {
    key: "_getFeaturesLength",
    value: function _getFeaturesLength(attributes) {
      if (!attributes) {
        return 0;
      }
      var firstKey = Object.keys(attributes)[0];
      return firstKey ? attributes[firstKey].length : 0;
    }
  }, {
    key: "_checkNormals",
    value: function _checkNormals(normals) {
      return normals.find(function (value) {
        return value;
      });
    }
  }]);
  return B3dmConverter;
}();
exports.default = B3dmConverter;
//# sourceMappingURL=b3dm-converter.js.map