"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertAttributes = convertAttributes;
exports.default = convertB3dmToI3sGeometry;
exports.getPropertyTable = getPropertyTable;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@math.gl/core");
var _geospatial = require("@math.gl/geospatial");
var _draco = require("@loaders.gl/draco");
var _core2 = require("@loaders.gl/core");
var _loaderUtils = require("@loaders.gl/loader-utils");
var _md = _interopRequireDefault(require("md5"));
var _uuid = require("uuid");
var _geometryAttributes = require("./geometry-attributes");
var _coordinateConverter = require("./coordinate-converter");
var _gltfAttributes = require("./gltf-attributes");
var _batchIdsExtensions = require("./batch-ids-extensions");
var _featureAttributes = require("./feature-attributes");
var _math = require("@loaders.gl/math");
var _geometryUtils = require("../../lib/utils/geometry-utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var DEFAULT_ROUGHNESS_FACTOR = 1;
var DEFAULT_METALLIC_FACTOR = 1;
var VALUES_PER_VERTEX = 3;
var VALUES_PER_TEX_COORD = 2;
var VALUES_PER_COLOR_ELEMENT = 4;
var STRING_TYPE = 'string';
var SHORT_INT_TYPE = 'Int32';
var DOUBLE_TYPE = 'Float64';
var OBJECT_ID_TYPE = 'Oid32';
var BATCHED_ID_POSSIBLE_ATTRIBUTE_NAMES = ['CUSTOM_ATTRIBUTE_2', '_BATCHID', 'BATCHID'];
var EXT_FEATURE_METADATA = 'EXT_feature_metadata';
var EXT_MESH_FEATURES = 'EXT_mesh_features';
var scratchVector = new _core.Vector3();
function convertB3dmToI3sGeometry(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
  return _convertB3dmToI3sGeometry.apply(this, arguments);
}
function _convertB3dmToI3sGeometry() {
  _convertB3dmToI3sGeometry = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(tileContent, addNodeToNodePage, propertyTable, featuresHashArray, attributeStorageInfo, draco, generateBoundingVolumes, shouldMergeMaterials, geoidHeightModel, workerSource) {
    var _tileContent$gltf4;
    var useCartesianPositions, materialAndTextureList, dataForAttributesConversion, convertedAttributesMap, result, _iterator6, _step6, materialAndTexture, originarMaterialId, convertedAttributes, material, texture, nodeId;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          useCartesianPositions = generateBoundingVolumes;
          _context.next = 3;
          return convertMaterials((_tileContent$gltf4 = tileContent.gltf) === null || _tileContent$gltf4 === void 0 ? void 0 : _tileContent$gltf4.materials, shouldMergeMaterials);
        case 3:
          materialAndTextureList = _context.sent;
          dataForAttributesConversion = (0, _gltfAttributes.prepareDataForAttributesConversion)(tileContent);
          _context.next = 7;
          return convertAttributes(dataForAttributesConversion, materialAndTextureList, useCartesianPositions);
        case 7:
          convertedAttributesMap = _context.sent;
          if (generateBoundingVolumes) {
            _generateBoundingVolumesFromGeometry(convertedAttributesMap, geoidHeightModel);
          }
          result = [];
          _iterator6 = _createForOfIteratorHelper(materialAndTextureList);
          _context.prev = 11;
          _iterator6.s();
        case 13:
          if ((_step6 = _iterator6.n()).done) {
            _context.next = 32;
            break;
          }
          materialAndTexture = _step6.value;
          originarMaterialId = materialAndTexture.mergedMaterials[0].originalMaterialId;
          if (convertedAttributesMap.has(originarMaterialId)) {
            _context.next = 18;
            break;
          }
          return _context.abrupt("continue", 30);
        case 18:
          convertedAttributes = convertedAttributesMap.get(originarMaterialId);
          if (convertedAttributes) {
            _context.next = 21;
            break;
          }
          return _context.abrupt("continue", 30);
        case 21:
          material = materialAndTexture.material, texture = materialAndTexture.texture;
          _context.next = 24;
          return addNodeToNodePage();
        case 24:
          nodeId = _context.sent;
          _context.t0 = result;
          _context.next = 28;
          return _makeNodeResources({
            convertedAttributes: convertedAttributes,
            material: material,
            texture: texture,
            tileContent: tileContent,
            nodeId: nodeId,
            featuresHashArray: featuresHashArray,
            propertyTable: propertyTable,
            attributeStorageInfo: attributeStorageInfo,
            draco: draco,
            workerSource: workerSource
          });
        case 28:
          _context.t1 = _context.sent;
          _context.t0.push.call(_context.t0, _context.t1);
        case 30:
          _context.next = 13;
          break;
        case 32:
          _context.next = 37;
          break;
        case 34:
          _context.prev = 34;
          _context.t2 = _context["catch"](11);
          _iterator6.e(_context.t2);
        case 37:
          _context.prev = 37;
          _iterator6.f();
          return _context.finish(37);
        case 40:
          if (result.length) {
            _context.next = 42;
            break;
          }
          return _context.abrupt("return", null);
        case 42:
          return _context.abrupt("return", result);
        case 43:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[11, 34, 37, 40]]);
  }));
  return _convertB3dmToI3sGeometry.apply(this, arguments);
}
function _generateBoundingVolumesFromGeometry(convertedAttributesMap, geoidHeightModel) {
  var _iterator = _createForOfIteratorHelper(convertedAttributesMap.values()),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var attributes = _step.value;
      var boundingVolumes = (0, _coordinateConverter.createBoundingVolumesFromGeometry)(attributes.positions, geoidHeightModel);
      attributes.boundingVolumes = boundingVolumes;
      var cartographicOrigin = boundingVolumes.obb.center;
      for (var index = 0; index < attributes.positions.length; index += VALUES_PER_VERTEX) {
        var vertex = attributes.positions.subarray(index, index + VALUES_PER_VERTEX);
        _geospatial.Ellipsoid.WGS84.cartesianToCartographic(Array.from(vertex), scratchVector);
        scratchVector[2] = scratchVector[2] - geoidHeightModel.getHeight(scratchVector[1], scratchVector[0]);
        scratchVector = scratchVector.subtract(cartographicOrigin);
        attributes.positions.set(scratchVector, index);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function _makeNodeResources(_x11) {
  return _makeNodeResources2.apply(this, arguments);
}
function _makeNodeResources2() {
  _makeNodeResources2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(_ref) {
    var _tileContent$gltf5;
    var convertedAttributes, material, texture, tileContent, nodeId, featuresHashArray, propertyTable, attributeStorageInfo, draco, workerSource, boundingVolumes, vertexCount, _generateAttributes, faceRange, featureIds, positions, normals, colors, uvRegions, texCoords, featureCount, header, typedFeatureIds, fileBuffer, compressedGeometry, attributes;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          convertedAttributes = _ref.convertedAttributes, material = _ref.material, texture = _ref.texture, tileContent = _ref.tileContent, nodeId = _ref.nodeId, featuresHashArray = _ref.featuresHashArray, propertyTable = _ref.propertyTable, attributeStorageInfo = _ref.attributeStorageInfo, draco = _ref.draco, workerSource = _ref.workerSource;
          boundingVolumes = convertedAttributes.boundingVolumes;
          vertexCount = convertedAttributes.positions.length / VALUES_PER_VERTEX;
          _generateAttributes = (0, _geometryAttributes.generateAttributes)(convertedAttributes), faceRange = _generateAttributes.faceRange, featureIds = _generateAttributes.featureIds, positions = _generateAttributes.positions, normals = _generateAttributes.normals, colors = _generateAttributes.colors, uvRegions = _generateAttributes.uvRegions, texCoords = _generateAttributes.texCoords, featureCount = _generateAttributes.featureCount;
          if (tileContent.batchTableJson) {
            makeFeatureIdsUnique(featureIds, convertedAttributes.featureIndices, featuresHashArray, tileContent.batchTableJson);
          }
          header = new Uint32Array(2);
          typedFeatureIds = generateBigUint64Array(featureIds);
          header.set([vertexCount, featureCount], 0);
          fileBuffer = new Uint8Array((0, _loaderUtils.concatenateArrayBuffers)(header.buffer, positions.buffer, normals.buffer, texture ? texCoords.buffer : new ArrayBuffer(0), colors.buffer, uvRegions, typedFeatureIds.buffer, faceRange.buffer));
          compressedGeometry = draco ? generateCompressedGeometry(vertexCount, convertedAttributes, {
            positions: positions,
            normals: normals,
            texCoords: texture ? texCoords : new Float32Array(0),
            colors: colors,
            uvRegions: uvRegions,
            featureIds: featureIds,
            faceRange: faceRange
          }, workerSource.draco) : null;
          attributes = [];
          if (attributeStorageInfo && propertyTable) {
            attributes = convertPropertyTableToAttributeBuffers(featureIds, propertyTable, attributeStorageInfo);
          }
          return _context2.abrupt("return", {
            nodeId: nodeId,
            geometry: fileBuffer,
            compressedGeometry: compressedGeometry,
            texture: texture,
            hasUvRegions: Boolean(uvRegions.length),
            sharedResources: getSharedResources(((_tileContent$gltf5 = tileContent.gltf) === null || _tileContent$gltf5 === void 0 ? void 0 : _tileContent$gltf5.materials) || [], nodeId),
            meshMaterial: material,
            vertexCount: vertexCount,
            attributes: attributes,
            featureCount: featureCount,
            boundingVolumes: boundingVolumes
          });
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _makeNodeResources2.apply(this, arguments);
}
function convertAttributes(_x12, _x13, _x14) {
  return _convertAttributes.apply(this, arguments);
}
function _convertAttributes() {
  _convertAttributes = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(attributesData, materialAndTextureList, useCartesianPositions) {
    var nodes, images, cartographicOrigin, cartesianModelMatrix, attributesMap, _iterator7, _step7, materialAndTexture, attributes, _iterator9, _step9, mergedMaterial, _iterator8, _step8, attrKey, _attributes;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          nodes = attributesData.nodes, images = attributesData.images, cartographicOrigin = attributesData.cartographicOrigin, cartesianModelMatrix = attributesData.cartesianModelMatrix;
          attributesMap = new Map();
          _iterator7 = _createForOfIteratorHelper(materialAndTextureList);
          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              materialAndTexture = _step7.value;
              attributes = {
                positions: new Float32Array(0),
                normals: new Float32Array(0),
                texCoords: new Float32Array(0),
                colors: new Uint8Array(0),
                uvRegions: new Uint16Array(0),
                featureIndicesGroups: [],
                featureIndices: [],
                boundingVolumes: null,
                mergedMaterials: materialAndTexture.mergedMaterials
              };
              _iterator9 = _createForOfIteratorHelper(materialAndTexture.mergedMaterials);
              try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                  mergedMaterial = _step9.value;
                  attributesMap.set(mergedMaterial.originalMaterialId, attributes);
                }
              } catch (err) {
                _iterator9.e(err);
              } finally {
                _iterator9.f();
              }
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
          convertNodes(nodes, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions);
          _iterator8 = _createForOfIteratorHelper(attributesMap.keys());
          _context3.prev = 6;
          _iterator8.s();
        case 8:
          if ((_step8 = _iterator8.n()).done) {
            _context3.next = 19;
            break;
          }
          attrKey = _step8.value;
          _attributes = attributesMap.get(attrKey);
          if (_attributes) {
            _context3.next = 13;
            break;
          }
          return _context3.abrupt("continue", 17);
        case 13:
          if (!(_attributes.positions.length === 0)) {
            _context3.next = 16;
            break;
          }
          attributesMap.delete(attrKey);
          return _context3.abrupt("continue", 17);
        case 16:
          if (_attributes.featureIndicesGroups) {
            _attributes.featureIndices = _attributes.featureIndicesGroups.reduce(function (acc, value) {
              return acc.concat(value);
            });
            delete _attributes.featureIndicesGroups;
          }
        case 17:
          _context3.next = 8;
          break;
        case 19:
          _context3.next = 24;
          break;
        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](6);
          _iterator8.e(_context3.t0);
        case 24:
          _context3.prev = 24;
          _iterator8.f();
          return _context3.finish(24);
        case 27:
          return _context3.abrupt("return", attributesMap);
        case 28:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[6, 21, 24, 27]]);
  }));
  return _convertAttributes.apply(this, arguments);
}
function convertNodes(nodes, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions) {
  var matrix = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new _core.Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  if (nodes) {
    var _iterator2 = _createForOfIteratorHelper(nodes),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var node = _step2.value;
        convertNode(node, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions, matrix);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
}
function getCompositeTransformationMatrix(node, matrix) {
  var transformationMatrix = matrix;
  var nodeMatrix = node.matrix,
    rotation = node.rotation,
    scale = node.scale,
    translation = node.translation;
  if (nodeMatrix) {
    transformationMatrix = matrix.multiplyRight(nodeMatrix);
  }
  if (translation) {
    transformationMatrix = transformationMatrix.translate(translation);
  }
  if (rotation) {
    transformationMatrix = transformationMatrix.rotateXYZ(rotation);
  }
  if (scale) {
    transformationMatrix = transformationMatrix.scale(scale);
  }
  return transformationMatrix;
}
function convertNode(node, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions) {
  var matrix = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new _core.Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  var transformationMatrix = getCompositeTransformationMatrix(node, matrix);
  var mesh = node.mesh;
  if (mesh) {
    convertMesh(mesh, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions, transformationMatrix);
  }
  convertNodes(node.children || [], images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions, transformationMatrix);
}
function convertMesh(mesh, images, cartographicOrigin, cartesianModelMatrix, attributesMap) {
  var useCartesianPositions = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var matrix = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new _core.Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  var _iterator3 = _createForOfIteratorHelper(mesh.primitives),
    _step3;
  try {
    var _loop = function _loop() {
      var primitive = _step3.value;
      var outputAttributes = null;
      var materialUvRegion;
      if (primitive.material) {
        var _outputAttributes, _outputAttributes$mer;
        outputAttributes = attributesMap.get(primitive.material.id);
        materialUvRegion = (_outputAttributes = outputAttributes) === null || _outputAttributes === void 0 ? void 0 : (_outputAttributes$mer = _outputAttributes.mergedMaterials.find(function (_ref2) {
          var _primitive$material;
          var originalMaterialId = _ref2.originalMaterialId;
          return originalMaterialId === ((_primitive$material = primitive.material) === null || _primitive$material === void 0 ? void 0 : _primitive$material.id);
        })) === null || _outputAttributes$mer === void 0 ? void 0 : _outputAttributes$mer.uvRegion;
      } else if (attributesMap.has('default')) {
        outputAttributes = attributesMap.get('default');
      }
      (0, _core2.assert)(outputAttributes !== null, 'Primitive - material mapping failed');
      (0, _core2.assert)(primitive.mode === undefined || primitive.mode === _math.GL.TRIANGLES || primitive.mode === _math.GL.TRIANGLE_STRIP, "Primitive - unsupported mode ".concat(primitive.mode));
      var attributes = primitive.attributes;
      if (!outputAttributes) {
        return "continue";
      }
      var indices = normalizeIndices(primitive);
      outputAttributes.positions = (0, _loaderUtils.concatenateTypedArrays)(outputAttributes.positions, transformVertexArray({
        vertices: attributes.POSITION.value,
        cartographicOrigin: cartographicOrigin,
        cartesianModelMatrix: cartesianModelMatrix,
        nodeMatrix: matrix,
        indices: indices,
        attributeSpecificTransformation: transformVertexPositions,
        useCartesianPositions: useCartesianPositions
      }));
      outputAttributes.normals = (0, _loaderUtils.concatenateTypedArrays)(outputAttributes.normals, transformVertexArray({
        vertices: attributes.NORMAL && attributes.NORMAL.value,
        cartographicOrigin: cartographicOrigin,
        cartesianModelMatrix: cartesianModelMatrix,
        nodeMatrix: matrix,
        indices: indices,
        attributeSpecificTransformation: transformVertexNormals,
        useCartesianPositions: false
      }));
      outputAttributes.texCoords = (0, _loaderUtils.concatenateTypedArrays)(outputAttributes.texCoords, flattenTexCoords(attributes.TEXCOORD_0 && attributes.TEXCOORD_0.value, indices));
      outputAttributes.colors = (0, _loaderUtils.concatenateTypedArrays)(outputAttributes.colors, flattenColors(attributes.COLOR_0, indices));
      if (materialUvRegion) {
        outputAttributes.uvRegions = (0, _loaderUtils.concatenateTypedArrays)(outputAttributes.uvRegions, createUvRegion(materialUvRegion, indices));
      }
      outputAttributes.featureIndicesGroups = outputAttributes.featureIndicesGroups || [];
      outputAttributes.featureIndicesGroups.push(flattenBatchIds(getBatchIds(attributes, primitive, images), indices));
    };
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _ret = _loop();
      if (_ret === "continue") continue;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
function normalizeIndices(primitive) {
  var _primitive$indices;
  var indices = (_primitive$indices = primitive.indices) === null || _primitive$indices === void 0 ? void 0 : _primitive$indices.value;
  if (!indices) {
    var positions = primitive.attributes.POSITION.value;
    return (0, _geometryUtils.generateSyntheticIndices)(positions.length / VALUES_PER_VERTEX);
  }
  if (indices && primitive.mode === _math.GL.TRIANGLE_STRIP) {
    var TypedArrayConstructor = indices.constructor;
    var newIndices = new TypedArrayConstructor((indices.length - 2) * 3);
    var triangleIndex = 0;
    var currentTriangle = indices.slice(0, 3);
    newIndices.set(currentTriangle, 0);
    for (var i = 1; i + 2 < indices.length; i++) {
      triangleIndex += 3;
      currentTriangle = indices.slice(i, i + 3);
      if (i % 2 === 0) {
        newIndices.set(currentTriangle, triangleIndex);
      } else {
        newIndices.set(currentTriangle.reverse(), triangleIndex);
      }
    }
    indices = newIndices;
  }
  return indices;
}
function transformVertexArray(args) {
  var vertices = args.vertices,
    indices = args.indices,
    attributeSpecificTransformation = args.attributeSpecificTransformation;
  var newVertices = new Float32Array(indices.length * VALUES_PER_VERTEX);
  if (!vertices) {
    return newVertices;
  }
  for (var i = 0; i < indices.length; i++) {
    var coordIndex = indices[i] * VALUES_PER_VERTEX;
    var vertex = vertices.subarray(coordIndex, coordIndex + VALUES_PER_VERTEX);
    var vertexVector = new _core.Vector3(Array.from(vertex));
    vertexVector = attributeSpecificTransformation(vertexVector, args);
    newVertices[i * VALUES_PER_VERTEX] = vertexVector.x;
    newVertices[i * VALUES_PER_VERTEX + 1] = vertexVector.y;
    newVertices[i * VALUES_PER_VERTEX + 2] = vertexVector.z;
  }
  return newVertices;
}
function transformVertexPositions(vertexVector, calleeArgs) {
  var cartesianModelMatrix = calleeArgs.cartesianModelMatrix,
    cartographicOrigin = calleeArgs.cartographicOrigin,
    nodeMatrix = calleeArgs.nodeMatrix,
    useCartesianPositions = calleeArgs.useCartesianPositions;
  if (nodeMatrix) {
    vertexVector = vertexVector.transform(nodeMatrix);
  }
  vertexVector = vertexVector.transform(cartesianModelMatrix);
  if (useCartesianPositions) {
    return vertexVector;
  }
  _geospatial.Ellipsoid.WGS84.cartesianToCartographic([vertexVector[0], vertexVector[1], vertexVector[2]], vertexVector);
  vertexVector = vertexVector.subtract(cartographicOrigin);
  return vertexVector;
}
function transformVertexNormals(vertexVector, calleeArgs) {
  var cartesianModelMatrix = calleeArgs.cartesianModelMatrix,
    nodeMatrix = calleeArgs.nodeMatrix;
  if (nodeMatrix) {
    vertexVector = vertexVector.transformAsVector(nodeMatrix);
  }
  vertexVector = vertexVector.transformAsVector(cartesianModelMatrix);
  return vertexVector;
}
function flattenTexCoords(texCoords, indices) {
  var newTexCoords = new Float32Array(indices.length * VALUES_PER_TEX_COORD);
  if (!texCoords) {
    newTexCoords.fill(1);
    return newTexCoords;
  }
  for (var i = 0; i < indices.length; i++) {
    var coordIndex = indices[i] * VALUES_PER_TEX_COORD;
    var texCoord = texCoords.subarray(coordIndex, coordIndex + VALUES_PER_TEX_COORD);
    newTexCoords[i * VALUES_PER_TEX_COORD] = texCoord[0];
    newTexCoords[i * VALUES_PER_TEX_COORD + 1] = texCoord[1];
  }
  return newTexCoords;
}
function flattenColors(colorsAttribute, indices) {
  var components = (colorsAttribute === null || colorsAttribute === void 0 ? void 0 : colorsAttribute.components) || VALUES_PER_COLOR_ELEMENT;
  var newColors = new Uint8Array(indices.length * components);
  if (!colorsAttribute) {
    newColors.fill(255);
    return newColors;
  }
  var colors = colorsAttribute.value;
  for (var i = 0; i < indices.length; i++) {
    var colorIndex = indices[i] * components;
    var color = colors.subarray(colorIndex, colorIndex + components);
    var colorUint8 = new Uint8Array(components);
    for (var j = 0; j < color.length; j++) {
      colorUint8[j] = color[j] * 255;
    }
    newColors.set(colorUint8, i * components);
  }
  return newColors;
}
function createUvRegion(materialUvRegion, indices) {
  var result = new Uint16Array(indices.length * 4);
  for (var i = 0; i < result.length; i += 4) {
    result.set(materialUvRegion, i);
  }
  return result;
}
function flattenBatchIds(batchedIds, indices) {
  if (!batchedIds.length || !indices.length) {
    return [];
  }
  var newBatchIds = [];
  for (var i = 0; i < indices.length; i++) {
    var coordIndex = indices[i];
    newBatchIds.push(batchedIds[coordIndex]);
  }
  return newBatchIds;
}
function getBatchIds(attributes, primitive, images) {
  var batchIds = (0, _batchIdsExtensions.handleBatchIdsExtensions)(attributes, primitive, images);
  if (batchIds.length) {
    return batchIds;
  }
  for (var index = 0; index < BATCHED_ID_POSSIBLE_ATTRIBUTE_NAMES.length; index++) {
    var possibleBatchIdAttributeName = BATCHED_ID_POSSIBLE_ATTRIBUTE_NAMES[index];
    if (attributes[possibleBatchIdAttributeName] && attributes[possibleBatchIdAttributeName].value) {
      return attributes[possibleBatchIdAttributeName].value;
    }
  }
  return [];
}
function convertMaterials() {
  return _convertMaterials.apply(this, arguments);
}
function _convertMaterials() {
  _convertMaterials = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
    var sourceMaterials,
      shouldMergeMaterials,
      materials,
      _iterator10,
      _step10,
      sourceMaterial,
      _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          sourceMaterials = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : [];
          shouldMergeMaterials = _args4.length > 1 ? _args4[1] : undefined;
          materials = [];
          _iterator10 = _createForOfIteratorHelper(sourceMaterials);
          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              sourceMaterial = _step10.value;
              materials.push(convertMaterial(sourceMaterial));
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
          if (!shouldMergeMaterials) {
            _context4.next = 9;
            break;
          }
          _context4.next = 8;
          return mergeAllMaterials(materials);
        case 8:
          materials = _context4.sent;
        case 9:
          return _context4.abrupt("return", materials);
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _convertMaterials.apply(this, arguments);
}
function mergeAllMaterials(_x15) {
  return _mergeAllMaterials.apply(this, arguments);
}
function _mergeAllMaterials() {
  _mergeAllMaterials = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(materials) {
    var result, newMaterial, mergedIndices, i, material, _newMaterial$mergedMa, _newMaterial$mergedMa2, newWidth, newHeight, currentX, _iterator11, _step11, aTextureMetadata, newX, _iterator12, _step12, index;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          result = [];
        case 1:
          if (!(materials.length > 0)) {
            _context5.next = 21;
            break;
          }
          newMaterial = materials.splice(0, 1)[0];
          mergedIndices = [];
          i = 0;
        case 5:
          if (!(i < materials.length)) {
            _context5.next = 15;
            break;
          }
          material = materials[i];
          if (!(newMaterial.texture && material.texture || !newMaterial.texture && !material.texture)) {
            _context5.next = 12;
            break;
          }
          _context5.next = 10;
          return mergeMaterials(newMaterial, material);
        case 10:
          newMaterial = _context5.sent;
          mergedIndices.push(i);
        case 12:
          i++;
          _context5.next = 5;
          break;
        case 15:
          if (newMaterial.texture && mergedIndices.length) {
            newWidth = (_newMaterial$mergedMa = newMaterial.mergedMaterials) === null || _newMaterial$mergedMa === void 0 ? void 0 : _newMaterial$mergedMa.reduce(function (accum, _ref5) {
              var textureSize = _ref5.textureSize;
              return accum + ((textureSize === null || textureSize === void 0 ? void 0 : textureSize.width) || 0);
            }, 0);
            newHeight = (_newMaterial$mergedMa2 = newMaterial.mergedMaterials) === null || _newMaterial$mergedMa2 === void 0 ? void 0 : _newMaterial$mergedMa2.reduce(function (accum, _ref6) {
              var textureSize = _ref6.textureSize;
              return Math.max(accum, (textureSize === null || textureSize === void 0 ? void 0 : textureSize.height) || 0);
            }, 0);
            currentX = -1;
            _iterator11 = _createForOfIteratorHelper(newMaterial.mergedMaterials);
            try {
              for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                aTextureMetadata = _step11.value;
                if (aTextureMetadata.textureSize) {
                  newX = currentX + 1 + aTextureMetadata.textureSize.width / newWidth * Math.pow(2, Uint16Array.BYTES_PER_ELEMENT * 8) - 1;
                  aTextureMetadata.uvRegion = new Uint16Array([currentX + 1, 0, newX, aTextureMetadata.textureSize.height / newHeight * Math.pow(2, Uint16Array.BYTES_PER_ELEMENT * 8) - 1]);
                  currentX = newX;
                }
              }
            } catch (err) {
              _iterator11.e(err);
            } finally {
              _iterator11.f();
            }
            newMaterial.texture.image.width = newWidth;
            newMaterial.texture.image.height = newHeight;
          }
          _iterator12 = _createForOfIteratorHelper(mergedIndices.reverse());
          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              index = _step12.value;
              materials.splice(index, 1);
            }
          } catch (err) {
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }
          result.push(newMaterial);
          _context5.next = 1;
          break;
        case 21:
          if (!result.length) {
            result.push({
              material: getDefaultMaterial(),
              mergedMaterials: [{
                originalMaterialId: 'default'
              }]
            });
          }
          return _context5.abrupt("return", result);
        case 23:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _mergeAllMaterials.apply(this, arguments);
}
function mergeMaterials(_x16, _x17) {
  return _mergeMaterials.apply(this, arguments);
}
function _mergeMaterials() {
  _mergeMaterials = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6(material1, material2) {
    var _material1$texture, _material2$texture;
    var buffer1, buffer2, _yield$import, joinImages, sharpData;
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!((_material1$texture = material1.texture) !== null && _material1$texture !== void 0 && _material1$texture.bufferView && (_material2$texture = material2.texture) !== null && _material2$texture !== void 0 && _material2$texture.bufferView && material1.mergedMaterials && material2.mergedMaterials)) {
            _context6.next = 21;
            break;
          }
          buffer1 = Buffer.from(material1.texture.bufferView.data);
          buffer2 = Buffer.from(material2.texture.bufferView.data);
          _context6.prev = 3;
          _context6.next = 6;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('join-images'));
          });
        case 6:
          _yield$import = _context6.sent;
          joinImages = _yield$import.joinImages;
          _context6.next = 10;
          return joinImages([buffer1, buffer2], {
            direction: 'horizontal'
          });
        case 10:
          sharpData = _context6.sent;
          _context6.next = 13;
          return sharpData.toFormat(material1.texture.mimeType === 'image/png' ? 'png' : 'jpeg').toBuffer();
        case 13:
          material1.texture.bufferView.data = _context6.sent;
          _context6.next = 20;
          break;
        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](3);
          console.log('Join images into a texture atlas has failed. Consider usage `--split-nodes` option. (See documentation https://loaders.gl/modules/tile-converter/docs/cli-reference/tile-converter)');
          throw _context6.t0;
        case 20:
          material1.material.pbrMetallicRoughness.baseColorTexture.textureSetDefinitionId = 1;
        case 21:
          material1.mergedMaterials = material1.mergedMaterials.concat(material2.mergedMaterials);
          return _context6.abrupt("return", material1);
        case 23:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[3, 16]]);
  }));
  return _mergeMaterials.apply(this, arguments);
}
function convertMaterial(sourceMaterial) {
  var _sourceMaterial$emiss, _sourceMaterial$pbrMe, _sourceMaterial$pbrMe2, _sourceMaterial$pbrMe3;
  var material = {
    doubleSided: sourceMaterial.doubleSided,
    emissiveFactor: (_sourceMaterial$emiss = sourceMaterial.emissiveFactor) === null || _sourceMaterial$emiss === void 0 ? void 0 : _sourceMaterial$emiss.map(function (c) {
      return Math.round(c * 255);
    }),
    alphaMode: convertAlphaMode(sourceMaterial.alphaMode),
    pbrMetallicRoughness: {
      roughnessFactor: (sourceMaterial === null || sourceMaterial === void 0 ? void 0 : (_sourceMaterial$pbrMe = sourceMaterial.pbrMetallicRoughness) === null || _sourceMaterial$pbrMe === void 0 ? void 0 : _sourceMaterial$pbrMe.roughnessFactor) || DEFAULT_ROUGHNESS_FACTOR,
      metallicFactor: (sourceMaterial === null || sourceMaterial === void 0 ? void 0 : (_sourceMaterial$pbrMe2 = sourceMaterial.pbrMetallicRoughness) === null || _sourceMaterial$pbrMe2 === void 0 ? void 0 : _sourceMaterial$pbrMe2.metallicFactor) || DEFAULT_METALLIC_FACTOR
    }
  };
  var texture;
  if (sourceMaterial !== null && sourceMaterial !== void 0 && (_sourceMaterial$pbrMe3 = sourceMaterial.pbrMetallicRoughness) !== null && _sourceMaterial$pbrMe3 !== void 0 && _sourceMaterial$pbrMe3.baseColorTexture) {
    texture = sourceMaterial.pbrMetallicRoughness.baseColorTexture.texture.source;
    material.pbrMetallicRoughness.baseColorTexture = {
      textureSetDefinitionId: 0
    };
  } else if (sourceMaterial.emissiveTexture) {
    texture = sourceMaterial.emissiveTexture.texture.source;
    material.pbrMetallicRoughness.baseColorTexture = {
      textureSetDefinitionId: 0
    };
  }
  sourceMaterial.id = Number.isFinite(sourceMaterial.id) ? sourceMaterial.id : (0, _uuid.v4)();
  var mergedMaterials = [{
    originalMaterialId: sourceMaterial.id
  }];
  if (!texture) {
    var _sourceMaterial$pbrMe4;
    var baseColorFactor = sourceMaterial === null || sourceMaterial === void 0 ? void 0 : (_sourceMaterial$pbrMe4 = sourceMaterial.pbrMetallicRoughness) === null || _sourceMaterial$pbrMe4 === void 0 ? void 0 : _sourceMaterial$pbrMe4.baseColorFactor;
    material.pbrMetallicRoughness.baseColorFactor = baseColorFactor && baseColorFactor.map(function (c) {
      return Math.round(c * 255);
    }) || undefined;
  } else {
    mergedMaterials[0].textureSize = {
      width: texture.image.width,
      height: texture.image.height
    };
  }
  return {
    material: material,
    texture: texture,
    mergedMaterials: mergedMaterials
  };
}
function convertAlphaMode(gltfAlphaMode) {
  switch (gltfAlphaMode) {
    case 'OPAQUE':
      return 'opaque';
    case 'MASK':
      return 'mask';
    case 'BLEND':
      return 'blend';
    default:
      return 'opaque';
  }
}
function getDefaultMaterial() {
  return {
    alphaMode: 'opaque',
    pbrMetallicRoughness: {
      metallicFactor: 1,
      roughnessFactor: 1
    }
  };
}
function getSharedResources(gltfMaterials, nodeId) {
  var i3sResources = {};
  if (!gltfMaterials || !gltfMaterials.length) {
    return i3sResources;
  }
  i3sResources.materialDefinitionInfos = [];
  var _iterator4 = _createForOfIteratorHelper(gltfMaterials),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var gltfMaterial = _step4.value;
      var _convertGLTFMaterialT = convertGLTFMaterialToI3sSharedResources(gltfMaterial, nodeId),
        materialDefinitionInfo = _convertGLTFMaterialT.materialDefinitionInfo,
        textureDefinitionInfo = _convertGLTFMaterialT.textureDefinitionInfo;
      i3sResources.materialDefinitionInfos.push(materialDefinitionInfo);
      if (textureDefinitionInfo) {
        i3sResources.textureDefinitionInfos = i3sResources.textureDefinitionInfos || [];
        i3sResources.textureDefinitionInfos.push(textureDefinitionInfo);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return i3sResources;
}
function convertGLTFMaterialToI3sSharedResources(gltfMaterial, nodeId) {
  var _gltfMaterial$pbrMeta;
  var texture = (gltfMaterial === null || gltfMaterial === void 0 ? void 0 : (_gltfMaterial$pbrMeta = gltfMaterial.pbrMetallicRoughness) === null || _gltfMaterial$pbrMeta === void 0 ? void 0 : _gltfMaterial$pbrMeta.baseColorTexture) || gltfMaterial.emissiveTexture;
  var textureDefinitionInfo = null;
  if (texture) {
    textureDefinitionInfo = extractSharedResourcesTextureInfo(texture.texture, nodeId);
  }
  var _ref3 = (gltfMaterial === null || gltfMaterial === void 0 ? void 0 : gltfMaterial.pbrMetallicRoughness) || {},
    baseColorFactor = _ref3.baseColorFactor,
    metallicFactor = _ref3.metallicFactor;
  var colorFactor = baseColorFactor;
  if ((!baseColorFactor || baseColorFactor[3] === 0) && gltfMaterial.emissiveFactor) {
    colorFactor = gltfMaterial.emissiveFactor;
    colorFactor[3] = colorFactor[3] || 1;
  }
  return {
    materialDefinitionInfo: extractSharedResourcesMaterialInfo(colorFactor || [1, 1, 1, 1], metallicFactor),
    textureDefinitionInfo: textureDefinitionInfo
  };
}
function extractSharedResourcesMaterialInfo(baseColorFactor) {
  var metallicFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var matDielectricColorComponent = 0.04 / 255;
  var black = new _core.Vector4(0, 0, 0, 1);
  var unitVector = new _core.Vector4(1, 1, 1, 1);
  var dielectricSpecular = new _core.Vector4(matDielectricColorComponent, matDielectricColorComponent, matDielectricColorComponent, 0);
  var baseColorVector = new _core.Vector4(baseColorFactor);
  var firstOperand = unitVector.subtract(dielectricSpecular).multiply(baseColorVector);
  var diffuse = firstOperand.lerp(firstOperand, black, metallicFactor);
  dielectricSpecular[3] = 1;
  var specular = dielectricSpecular.lerp(dielectricSpecular, baseColorVector, metallicFactor);
  return {
    params: {
      diffuse: diffuse.toArray(),
      specular: specular.toArray(),
      renderMode: 'solid'
    }
  };
}
function extractSharedResourcesTextureInfo(texture, nodeId) {
  var _texture$source, _texture$source2, _texture$source3, _texture$source4;
  return {
    encoding: texture !== null && texture !== void 0 && (_texture$source = texture.source) !== null && _texture$source !== void 0 && _texture$source.mimeType ? [texture.source.mimeType] : undefined,
    images: [{
      id: generateImageId(texture, nodeId),
      size: (_texture$source2 = texture.source) === null || _texture$source2 === void 0 ? void 0 : _texture$source2.image.width,
      length: (_texture$source3 = texture.source) !== null && _texture$source3 !== void 0 && _texture$source3.image.data.length ? [(_texture$source4 = texture.source) === null || _texture$source4 === void 0 ? void 0 : _texture$source4.image.data.length] : undefined
    }]
  };
}
function generateImageId(texture, nodeId) {
  var _texture$source5;
  var _ref4 = ((_texture$source5 = texture.source) === null || _texture$source5 === void 0 ? void 0 : _texture$source5.image) || {},
    width = _ref4.width,
    height = _ref4.height;
  if (!width || !height) {
    return '';
  }
  var levelCountOfTexture = 1;
  var indexOfLevel = 0;
  var indexOfTextureInStore = nodeId + 1;
  var zerosCount = 32 - indexOfTextureInStore.toString(2).length;
  var rightHalf = '0'.repeat(zerosCount).concat(indexOfTextureInStore.toString(2));
  var shiftedLevelCountOfTexture = levelCountOfTexture << 28;
  var shiftedIndexOfLevel = indexOfLevel << 24;
  var shiftedWidth = width - 1 << 12;
  var shiftedHeight = height - 1 << 0;
  var leftHalf = shiftedLevelCountOfTexture + shiftedIndexOfLevel + shiftedWidth + shiftedHeight;
  var imageId = BigInt("0b".concat(leftHalf.toString(2)).concat(rightHalf));
  return imageId.toString();
}
function makeFeatureIdsUnique(featureIds, featureIndices, featuresHashArray, batchTable) {
  var replaceMap = getFeaturesReplaceMap(featureIds, batchTable, featuresHashArray);
  replaceIndicesByUnique(featureIndices, replaceMap);
  replaceIndicesByUnique(featureIds, replaceMap);
}
function getFeaturesReplaceMap(featureIds, batchTable, featuresHashArray) {
  var featureMap = {};
  for (var index = 0; index < featureIds.length; index++) {
    var oldFeatureId = featureIds[index];
    var uniqueFeatureId = getOrCreateUniqueFeatureId(index, batchTable, featuresHashArray);
    featureMap[oldFeatureId.toString()] = uniqueFeatureId;
  }
  return featureMap;
}
function generateStringFromBatchTableByIndex(batchTable, index) {
  var str = '';
  for (var _key in batchTable) {
    str += batchTable[_key][index];
  }
  return str;
}
function getOrCreateUniqueFeatureId(index, batchTable, featuresHashArray) {
  var batchTableStr = generateStringFromBatchTableByIndex(batchTable, index);
  var hash = (0, _md.default)(batchTableStr);
  if (featuresHashArray.includes(hash)) {
    return featuresHashArray.indexOf(hash);
  }
  return featuresHashArray.push(hash) - 1;
}
function replaceIndicesByUnique(indicesArray, featureMap) {
  for (var index = 0; index < indicesArray.length; index++) {
    indicesArray[index] = featureMap[indicesArray[index]];
  }
}
function convertPropertyTableToAttributeBuffers(featureIds, propertyTable, attributeStorageInfo) {
  var attributeBuffers = [];
  var needFlattenPropertyTable = (0, _featureAttributes.checkPropertiesLength)(featureIds, propertyTable);
  var properties = needFlattenPropertyTable ? (0, _featureAttributes.flattenPropertyTableByFeatureIds)(featureIds, propertyTable) : propertyTable;
  var propertyTableWithObjectIds = _objectSpread({
    OBJECTID: featureIds
  }, properties);
  for (var propertyName in propertyTableWithObjectIds) {
    var type = getAttributeType(propertyName, attributeStorageInfo);
    var value = propertyTableWithObjectIds[propertyName];
    var attributeBuffer = generateAttributeBuffer(type, value);
    attributeBuffers.push(attributeBuffer);
  }
  return attributeBuffers;
}
function generateAttributeBuffer(type, value) {
  var attributeBuffer;
  switch (type) {
    case OBJECT_ID_TYPE:
    case SHORT_INT_TYPE:
      attributeBuffer = generateShortIntegerAttributeBuffer(value);
      break;
    case DOUBLE_TYPE:
      attributeBuffer = generateDoubleAttributeBuffer(value);
      break;
    case STRING_TYPE:
      attributeBuffer = generateStringAttributeBuffer(value);
      break;
    default:
      attributeBuffer = generateStringAttributeBuffer(value);
  }
  return attributeBuffer;
}
function getAttributeType(key, attributeStorageInfo) {
  var attribute = attributeStorageInfo.find(function (attr) {
    return attr.name === key;
  });
  return attribute.attributeValues.valueType;
}
function generateShortIntegerAttributeBuffer(featureIds) {
  var count = new Uint32Array([featureIds.length]);
  var valuesArray = new Uint32Array(featureIds);
  return (0, _loaderUtils.concatenateArrayBuffers)(count.buffer, valuesArray.buffer);
}
function generateDoubleAttributeBuffer(featureIds) {
  var count = new Uint32Array([featureIds.length]);
  var padding = new Uint8Array(4);
  var valuesArray = new Float64Array(featureIds);
  return (0, _loaderUtils.concatenateArrayBuffers)(count.buffer, padding.buffer, valuesArray.buffer);
}
function generateStringAttributeBuffer(batchAttributes) {
  var stringCountArray = new Uint32Array([batchAttributes.length]);
  var totalNumberOfBytes = 0;
  var stringSizesArray = new Uint32Array(batchAttributes.length);
  var stringBufferArray = [];
  for (var index = 0; index < batchAttributes.length; index++) {
    var currentString = "".concat(String(batchAttributes[index]), "\0");
    var currentStringBuffer = Buffer.from(currentString);
    var currentStringSize = currentStringBuffer.length;
    totalNumberOfBytes += currentStringSize;
    stringSizesArray[index] = currentStringSize;
    stringBufferArray.push(currentStringBuffer);
  }
  var totalBytes = new Uint32Array([totalNumberOfBytes]);
  return _loaderUtils.concatenateArrayBuffers.apply(void 0, [stringCountArray.buffer, totalBytes.buffer, stringSizesArray.buffer].concat(stringBufferArray));
}
function generateBigUint64Array(featureIds) {
  var typedFeatureIds = new BigUint64Array(featureIds.length);
  for (var index = 0; index < featureIds.length; index++) {
    typedFeatureIds[index] = BigInt(featureIds[index]);
  }
  return typedFeatureIds;
}
function generateCompressedGeometry(_x18, _x19, _x20, _x21) {
  return _generateCompressedGeometry.apply(this, arguments);
}
function _generateCompressedGeometry() {
  _generateCompressedGeometry = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7(vertexCount, convertedAttributes, attributes, dracoWorkerSoure) {
    var positions, normals, texCoords, colors, uvRegions, featureIds, faceRange, indices, index, featureIndices, featureIndex, compressedAttributes, attributesMetadata;
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          positions = attributes.positions, normals = attributes.normals, texCoords = attributes.texCoords, colors = attributes.colors, uvRegions = attributes.uvRegions, featureIds = attributes.featureIds, faceRange = attributes.faceRange;
          indices = new Uint32Array(vertexCount);
          for (index = 0; index < indices.length; index++) {
            indices.set([index], index);
          }
          featureIndices = new Uint32Array(convertedAttributes.featureIndices.length ? convertedAttributes.featureIndices : vertexCount);
          featureIndex = generateFeatureIndexAttribute(featureIndices, faceRange);
          compressedAttributes = {
            positions: positions,
            normals: normals,
            colors: colors,
            'feature-index': featureIndex
          };
          if (texCoords.length) {
            compressedAttributes.texCoords = texCoords;
          }
          attributesMetadata = {
            'feature-index': {
              'i3s-attribute-type': 'feature-index',
              'i3s-feature-ids': new Int32Array(featureIds)
            }
          };
          if (uvRegions.length) {
            compressedAttributes['uv-region'] = uvRegions;
            attributesMetadata['uv-region'] = {
              'i3s-attribute-type': 'uv-region'
            };
          }
          return _context7.abrupt("return", (0, _core2.encode)({
            attributes: compressedAttributes,
            indices: indices
          }, _draco.DracoWriterWorker, _objectSpread(_objectSpread({}, _draco.DracoWriterWorker.options), {}, {
            source: dracoWorkerSoure,
            reuseWorkers: true,
            _nodeWorkers: true,
            draco: {
              method: 'MESH_SEQUENTIAL_ENCODING',
              attributesMetadata: attributesMetadata
            }
          })));
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _generateCompressedGeometry.apply(this, arguments);
}
function generateFeatureIndexAttribute(featureIndex, faceRange) {
  var orderedFeatureIndices = new Uint32Array(featureIndex.length);
  var fillIndex = 0;
  var startIndex = 0;
  for (var index = 1; index < faceRange.length; index += 2) {
    var endIndex = (faceRange[index] + 1) * VALUES_PER_VERTEX;
    orderedFeatureIndices.fill(fillIndex, startIndex, endIndex);
    fillIndex++;
    startIndex = endIndex + 1;
  }
  return orderedFeatureIndices;
}
function getPropertyTable(tileContent) {
  var batchTableJson = tileContent === null || tileContent === void 0 ? void 0 : tileContent.batchTableJson;
  if (batchTableJson) {
    return batchTableJson;
  }
  var _getPropertyTableExte = getPropertyTableExtension(tileContent),
    extensionName = _getPropertyTableExte.extensionName,
    extension = _getPropertyTableExte.extension;
  switch (extensionName) {
    case EXT_MESH_FEATURES:
      {
        console.warn('The I3S converter does not yet support the EXT_mesh_features extension');
        return null;
      }
    case EXT_FEATURE_METADATA:
      {
        return getPropertyTableFromExtFeatureMetadata(extension);
      }
    default:
      return null;
  }
}
function getPropertyTableExtension(tileContent) {
  var _tileContent$gltf, _tileContent$gltf2, _tileContent$gltf2$ex, _tileContent$gltf3;
  var extensionsWithPropertyTables = [EXT_FEATURE_METADATA, EXT_MESH_FEATURES];
  var extensionsUsed = tileContent === null || tileContent === void 0 ? void 0 : (_tileContent$gltf = tileContent.gltf) === null || _tileContent$gltf === void 0 ? void 0 : _tileContent$gltf.extensionsUsed;
  if (!extensionsUsed) {
    return {
      extensionName: null,
      extension: null
    };
  }
  var extensionName = '';
  var _iterator5 = _createForOfIteratorHelper((tileContent === null || tileContent === void 0 ? void 0 : (_tileContent$gltf3 = tileContent.gltf) === null || _tileContent$gltf3 === void 0 ? void 0 : _tileContent$gltf3.extensionsUsed) || []),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var extensionItem = _step5.value;
      if (extensionsWithPropertyTables.includes(extensionItem)) {
        extensionName = extensionItem;
        break;
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  var extension = tileContent === null || tileContent === void 0 ? void 0 : (_tileContent$gltf2 = tileContent.gltf) === null || _tileContent$gltf2 === void 0 ? void 0 : (_tileContent$gltf2$ex = _tileContent$gltf2.extensions) === null || _tileContent$gltf2$ex === void 0 ? void 0 : _tileContent$gltf2$ex[extensionName];
  return {
    extensionName: extensionName,
    extension: extension
  };
}
function getPropertyTableFromExtFeatureMetadata(extension) {
  if (extension !== null && extension !== void 0 && extension.featureTextures) {
    console.warn('The I3S converter does not yet support the EXT_feature_metadata feature textures');
    return null;
  }
  if (extension !== null && extension !== void 0 && extension.featureTables) {
    var _Object$keys;
    var firstFeatureTableName = (_Object$keys = Object.keys(extension.featureTables)) === null || _Object$keys === void 0 ? void 0 : _Object$keys[0];
    if (firstFeatureTableName) {
      var featureTable = extension === null || extension === void 0 ? void 0 : extension.featureTables[firstFeatureTableName];
      var propertyTable = {};
      for (var propertyName in featureTable.properties) {
        propertyTable[propertyName] = featureTable.properties[propertyName].data;
      }
      return propertyTable;
    }
  }
  console.warn("The I3S converter couldn't handle EXT_feature_metadata extension");
  return null;
}
//# sourceMappingURL=geometry-converter.js.map