"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateAttributes = generateAttributes;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _loaderUtils = require("@loaders.gl/loader-utils");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var VALUES_PER_VERTEX = 3;
var POSITIONS_AND_NORMALS_PER_TRIANGLE = 9;
function generateAttributes(attributes) {
  var positions = attributes.positions,
    normals = attributes.normals,
    texCoords = attributes.texCoords,
    colors = attributes.colors,
    uvRegions = attributes.uvRegions,
    featureIndices = attributes.featureIndices;
  var triangleCount = positions.length / POSITIONS_AND_NORMALS_PER_TRIANGLE;
  if (!featureIndices.length) {
    return {
      faceRange: new Uint32Array([0, triangleCount - 1]),
      featureIds: [0],
      featureCount: 1,
      positions: positions,
      normals: normals,
      texCoords: texCoords,
      colors: colors,
      uvRegions: uvRegions
    };
  }
  var data = calculateFaceRangesAndFeaturesCount(featureIndices);
  var attributeObjects = makeAttributeObjects(_objectSpread(_objectSpread({}, data), attributes));
  var unifiedAttributeObjectsByFeatureIds = unifyObjectsByFeatureId(attributeObjects);
  var groupedAttributes = groupAttributesAndRangesByFeatureId(unifiedAttributeObjectsByFeatureIds, data.featureCount);
  return groupedAttributes;
}
function calculateFaceRangesAndFeaturesCount(featureIndices) {
  var rangeIndex = 1;
  var featureIndex = 1;
  var currentFeatureId = getFrequentValue(featureIndices.slice(0, VALUES_PER_VERTEX));
  var faceRangeList = [];
  var featureIds = [];
  var uniqueFeatureIds = [currentFeatureId];
  faceRangeList[0] = 0;
  featureIds[0] = currentFeatureId;
  for (var index = VALUES_PER_VERTEX; index < featureIndices.length; index += VALUES_PER_VERTEX) {
    var newFeatureId = getFrequentValue(featureIndices.slice(index, index + VALUES_PER_VERTEX));
    if (currentFeatureId !== newFeatureId) {
      faceRangeList[rangeIndex] = index / VALUES_PER_VERTEX - 1;
      faceRangeList[rangeIndex + 1] = index / VALUES_PER_VERTEX;
      featureIds[featureIndex] = newFeatureId;
      if (!uniqueFeatureIds.includes(newFeatureId)) {
        uniqueFeatureIds.push(newFeatureId);
      }
      rangeIndex += 2;
      featureIndex += 1;
    }
    currentFeatureId = newFeatureId;
  }
  faceRangeList[rangeIndex] = featureIndices.length / VALUES_PER_VERTEX - 1;
  var faceRange = new Uint32Array(faceRangeList);
  var featureCount = uniqueFeatureIds.length;
  return {
    faceRange: faceRange,
    featureCount: featureCount,
    featureIds: featureIds
  };
}
function getFrequentValue(values) {
  var map = {};
  var mostFrequentValue = values[0];
  var maxCount = 1;
  var _iterator = _createForOfIteratorHelper(values),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var value = _step.value;
      map[value] = (map[value] || 0) + 1;
      maxCount = maxCount > map[value] ? maxCount : map[value];
      mostFrequentValue = maxCount > map[value] ? mostFrequentValue : value;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return mostFrequentValue;
}
function makeAttributeObjects(attributes) {
  var featureIds = attributes.featureIds,
    positions = attributes.positions,
    normals = attributes.normals,
    colors = attributes.colors,
    uvRegions = attributes.uvRegions,
    texCoords = attributes.texCoords,
    _attributes$faceRange = attributes.faceRange,
    faceRange = _attributes$faceRange === void 0 ? new Uint32Array(0) : _attributes$faceRange;
  var groupedData = [];
  var positionsList = new Float32Array(positions);
  var normalsList = new Float32Array(normals);
  var colorsList = new Uint8Array(colors);
  var texCoordsList = new Float32Array(texCoords);
  var uvRegionsList = new Uint16Array(uvRegions);
  for (var index = 0; index < featureIds.length; index++) {
    var startIndex = faceRange[index * 2];
    var endIndex = faceRange[index * 2 + 1];
    var positionsCount = getSliceAttributeCount('positions', startIndex, endIndex);
    var normalsCount = getSliceAttributeCount('normals', startIndex, endIndex);
    var colorsCount = getSliceAttributeCount('colors', startIndex, endIndex);
    var uvRegionsCount = getSliceAttributeCount('uvRegions', startIndex, endIndex);
    var texCoordsCount = getSliceAttributeCount('texCoords', startIndex, endIndex);
    groupedData.push({
      featureId: featureIds[index],
      positions: positionsList.slice(0, positionsCount),
      normals: normalsList.slice(0, normalsCount),
      colors: colorsList.slice(0, colorsCount),
      uvRegions: uvRegionsList.slice(0, uvRegionsCount),
      texCoords: texCoordsList.slice(0, texCoordsCount)
    });
    positionsList = positionsList.slice(positionsCount);
    normalsList = normalsList.slice(normalsCount);
    colorsList = colorsList.slice(colorsCount);
    uvRegionsList = uvRegionsList.slice(uvRegionsCount);
    texCoordsList = texCoordsList.slice(texCoordsCount);
  }
  return groupedData.sort(function (first, second) {
    return first.featureId - second.featureId;
  });
}
function getSliceAttributeCount(attributeName, startIndex, endIndex) {
  var itemsPerVertex4 = 4;
  var texCoordsPerVertex = 2;
  var trianglesCount = endIndex - startIndex + 1;
  var vertexCount = trianglesCount * 3;
  switch (attributeName) {
    case 'positions':
    case 'normals':
      return trianglesCount * POSITIONS_AND_NORMALS_PER_TRIANGLE;
    case 'colors':
    case 'uvRegions':
      return vertexCount * itemsPerVertex4;
    case 'texCoords':
      return vertexCount * texCoordsPerVertex;
    default:
      return 0;
  }
}
function unifyObjectsByFeatureId(sortedData) {
  var uniqueObjects = [];
  var _loop = function _loop() {
    var currentObject = sortedData[index];
    var existedObject = uniqueObjects.find(function (obj) {
      return obj.featureId === currentObject.featureId;
    });
    if (existedObject) {
      existedObject.positions = (0, _loaderUtils.concatenateTypedArrays)(existedObject.positions, currentObject.positions);
      existedObject.normals = (0, _loaderUtils.concatenateTypedArrays)(existedObject.normals, currentObject.normals);
      existedObject.colors = (0, _loaderUtils.concatenateTypedArrays)(existedObject.colors, currentObject.colors);
      existedObject.texCoords = (0, _loaderUtils.concatenateTypedArrays)(existedObject.texCoords, currentObject.texCoords);
    } else {
      uniqueObjects.push(currentObject);
    }
  };
  for (var index = 0; index < sortedData.length; index++) {
    _loop();
  }
  return uniqueObjects;
}
function groupAttributesAndRangesByFeatureId(unifiedObjects, featureCount) {
  var firstAttributeObject = unifiedObjects[0];
  var featureIds = [firstAttributeObject.featureId || 0];
  var positions = new Float32Array(firstAttributeObject.positions);
  var normals = new Float32Array(firstAttributeObject.normals);
  var colors = new Uint8Array(firstAttributeObject.colors);
  var uvRegions = new Uint16Array(firstAttributeObject.uvRegions);
  var texCoords = new Float32Array(firstAttributeObject.texCoords);
  var range = [0];
  var objIndex = 0;
  var sum = 0;
  for (var index = 1; index < unifiedObjects.length; index++) {
    var currentAttributesObject = unifiedObjects[index];
    featureIds.push(currentAttributesObject.featureId || 0);
    positions = (0, _loaderUtils.concatenateTypedArrays)(positions, currentAttributesObject.positions);
    normals = (0, _loaderUtils.concatenateTypedArrays)(normals, currentAttributesObject.normals);
    colors = (0, _loaderUtils.concatenateTypedArrays)(colors, currentAttributesObject.colors);
    uvRegions = (0, _loaderUtils.concatenateTypedArrays)(uvRegions, currentAttributesObject.uvRegions);
    texCoords = (0, _loaderUtils.concatenateTypedArrays)(texCoords, currentAttributesObject.texCoords);
    var groupedObject = unifiedObjects[objIndex];
    range.push(groupedObject.positions.length / POSITIONS_AND_NORMALS_PER_TRIANGLE - 1 + sum);
    range.push(groupedObject.positions.length / POSITIONS_AND_NORMALS_PER_TRIANGLE + sum);
    sum += groupedObject.positions.length / POSITIONS_AND_NORMALS_PER_TRIANGLE;
    objIndex += 1;
  }
  range.push(positions.length / POSITIONS_AND_NORMALS_PER_TRIANGLE - 1);
  var faceRange = new Uint32Array(range);
  return {
    faceRange: faceRange,
    featureIds: featureIds,
    positions: positions,
    normals: normals,
    colors: colors,
    uvRegions: uvRegions,
    texCoords: texCoords,
    featureCount: featureCount
  };
}
//# sourceMappingURL=geometry-attributes.js.map