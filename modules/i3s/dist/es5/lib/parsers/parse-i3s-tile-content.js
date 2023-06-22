"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseI3STileContent = parseI3STileContent;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@loaders.gl/core");
var _core2 = require("@math.gl/core");
var _geospatial = require("@math.gl/geospatial");
var _images = require("@loaders.gl/images");
var _draco = require("@loaders.gl/draco");
var _textures = require("@loaders.gl/textures");
var _types = require("../../types");
var _urlUtils = require("../utils/url-utils");
var _constants = require("./constants");
var _customizeColors = require("../utils/customizeColors");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var scratchVector = new _core2.Vector3([0, 0, 0]);
function getLoaderForTextureFormat(textureFormat) {
  switch (textureFormat) {
    case 'ktx-etc2':
    case 'dds':
      return _textures.CompressedTextureLoader;
    case 'ktx2':
      return _textures.BasisLoader;
    case 'jpg':
    case 'png':
    default:
      return _images.ImageLoader;
  }
}
var I3S_ATTRIBUTE_TYPE = 'i3s-attribute-type';
function parseI3STileContent(_x, _x2, _x3, _x4, _x5) {
  return _parseI3STileContent.apply(this, arguments);
}
function _parseI3STileContent() {
  _parseI3STileContent = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, tileOptions, tilesetOptions, options, context) {
    var content, _options$i3s, url, loader, response, _arrayBuffer, _options, texture;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          content = {
            attributes: {},
            indices: null,
            featureIds: [],
            vertexCount: 0,
            modelMatrix: new _core2.Matrix4(),
            coordinateSystem: 0,
            byteLength: 0,
            texture: null
          };
          if (!tileOptions.textureUrl) {
            _context.next = 35;
            break;
          }
          url = (0, _urlUtils.getUrlWithToken)(tileOptions.textureUrl, options === null || options === void 0 ? void 0 : (_options$i3s = options.i3s) === null || _options$i3s === void 0 ? void 0 : _options$i3s.token);
          loader = getLoaderForTextureFormat(tileOptions.textureFormat);
          _context.next = 6;
          return fetch(url, options === null || options === void 0 ? void 0 : options.fetch);
        case 6:
          response = _context.sent;
          _context.next = 9;
          return response.arrayBuffer();
        case 9:
          _arrayBuffer = _context.sent;
          if (!(options !== null && options !== void 0 && options.i3s.decodeTextures)) {
            _context.next = 34;
            break;
          }
          if (!(loader === _images.ImageLoader)) {
            _context.next = 26;
            break;
          }
          _options = _objectSpread(_objectSpread({}, tileOptions.textureLoaderOptions), {}, {
            image: {
              type: 'data'
            }
          });
          _context.prev = 13;
          _context.next = 16;
          return context.parse(_arrayBuffer, _options);
        case 16:
          content.texture = _context.sent;
          _context.next = 24;
          break;
        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](13);
          _context.next = 23;
          return (0, _core.parse)(_arrayBuffer, loader, _options);
        case 23:
          content.texture = _context.sent;
        case 24:
          _context.next = 32;
          break;
        case 26:
          if (!(loader === _textures.CompressedTextureLoader || loader === _textures.BasisLoader)) {
            _context.next = 32;
            break;
          }
          _context.next = 29;
          return (0, _core.load)(_arrayBuffer, loader, tileOptions.textureLoaderOptions);
        case 29:
          texture = _context.sent;
          if (loader === _textures.BasisLoader) {
            texture = texture[0];
          }
          content.texture = {
            compressed: true,
            mipmaps: false,
            width: texture[0].width,
            height: texture[0].height,
            data: texture
          };
        case 32:
          _context.next = 35;
          break;
        case 34:
          content.texture = _arrayBuffer;
        case 35:
          content.material = makePbrMaterial(tileOptions.materialDefinition, content.texture);
          if (content.material) {
            content.texture = null;
          }
          _context.next = 39;
          return parseI3SNodeGeometry(arrayBuffer, content, tileOptions, tilesetOptions, options);
        case 39:
          return _context.abrupt("return", _context.sent);
        case 40:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[13, 19]]);
  }));
  return _parseI3STileContent.apply(this, arguments);
}
function parseI3SNodeGeometry(_x6, _x7, _x8, _x9, _x10) {
  return _parseI3SNodeGeometry.apply(this, arguments);
}
function _parseI3SNodeGeometry() {
  _parseI3SNodeGeometry = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, content, tileOptions, tilesetOptions, options) {
    var _options$i3s2;
    var contentByteLength, attributes, vertexCount, byteOffset, featureCount, indices, _decompressedGeometry, decompressedGeometry, _decompressedGeometry2, POSITION, NORMAL, COLOR_0, TEXCOORD_0, featureIndex, uvRegion, featureIds, _tilesetOptions$store, vertexAttributes, attributesOrder, featureAttributes, featureAttributeOrder, headers, _normalizeAttributes, normalizedVertexAttributes, offset, _normalizeAttributes2, normalizedFeatureAttributes, enuMatrix, attributeIndex;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          contentByteLength = arrayBuffer.byteLength;
          byteOffset = 0;
          featureCount = 0;
          if (!tileOptions.isDracoGeometry) {
            _context2.next = 16;
            break;
          }
          _context2.next = 6;
          return (0, _core.parse)(arrayBuffer, _draco.DracoLoader, {
            draco: {
              attributeNameEntry: I3S_ATTRIBUTE_TYPE
            }
          });
        case 6:
          decompressedGeometry = _context2.sent;
          vertexCount = decompressedGeometry.header.vertexCount;
          indices = (_decompressedGeometry = decompressedGeometry.indices) === null || _decompressedGeometry === void 0 ? void 0 : _decompressedGeometry.value;
          _decompressedGeometry2 = decompressedGeometry.attributes, POSITION = _decompressedGeometry2.POSITION, NORMAL = _decompressedGeometry2.NORMAL, COLOR_0 = _decompressedGeometry2.COLOR_0, TEXCOORD_0 = _decompressedGeometry2.TEXCOORD_0, featureIndex = _decompressedGeometry2['feature-index'], uvRegion = _decompressedGeometry2['uv-region'];
          attributes = {
            position: POSITION,
            normal: NORMAL,
            color: COLOR_0,
            uv0: TEXCOORD_0,
            uvRegion: uvRegion,
            id: featureIndex
          };
          updateAttributesMetadata(attributes, decompressedGeometry);
          featureIds = getFeatureIdsFromFeatureIndexMetadata(featureIndex);
          if (featureIds) {
            flattenFeatureIdsByFeatureIndices(attributes, featureIds);
          }
          _context2.next = 25;
          break;
        case 16:
          _tilesetOptions$store = tilesetOptions.store.defaultGeometrySchema, vertexAttributes = _tilesetOptions$store.vertexAttributes, attributesOrder = _tilesetOptions$store.ordering, featureAttributes = _tilesetOptions$store.featureAttributes, featureAttributeOrder = _tilesetOptions$store.featureAttributeOrder;
          headers = parseHeaders(arrayBuffer, tilesetOptions);
          byteOffset = headers.byteOffset;
          vertexCount = headers.vertexCount;
          featureCount = headers.featureCount;
          _normalizeAttributes = normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, vertexCount, attributesOrder), normalizedVertexAttributes = _normalizeAttributes.attributes, offset = _normalizeAttributes.byteOffset;
          _normalizeAttributes2 = normalizeAttributes(arrayBuffer, offset, featureAttributes, featureCount, featureAttributeOrder), normalizedFeatureAttributes = _normalizeAttributes2.attributes;
          flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes);
          attributes = concatAttributes(normalizedVertexAttributes, normalizedFeatureAttributes);
        case 25:
          if (!(options !== null && options !== void 0 && (_options$i3s2 = options.i3s) !== null && _options$i3s2 !== void 0 && _options$i3s2.coordinateSystem) || options.i3s.coordinateSystem === _constants.COORDINATE_SYSTEM.METER_OFFSETS) {
            enuMatrix = parsePositions(attributes.position, tileOptions);
            content.modelMatrix = enuMatrix.invert();
            content.coordinateSystem = _constants.COORDINATE_SYSTEM.METER_OFFSETS;
          } else {
            content.modelMatrix = getModelMatrix(attributes.position);
            content.coordinateSystem = _constants.COORDINATE_SYSTEM.LNGLAT_OFFSETS;
          }
          _context2.next = 28;
          return (0, _customizeColors.customizeColors)(attributes.color, attributes.id, tileOptions, tilesetOptions, options);
        case 28:
          attributes.color = _context2.sent;
          content.attributes = {
            positions: attributes.position,
            normals: attributes.normal,
            colors: normalizeAttribute(attributes.color),
            texCoords: attributes.uv0,
            uvRegions: normalizeAttribute(attributes.uvRegion || attributes.region)
          };
          content.indices = indices || null;
          if (attributes.id && attributes.id.value) {
            content.featureIds = attributes.id.value;
          }
          for (attributeIndex in content.attributes) {
            if (!content.attributes[attributeIndex]) {
              delete content.attributes[attributeIndex];
            }
          }
          content.vertexCount = vertexCount;
          content.byteLength = contentByteLength;
          return _context2.abrupt("return", content);
        case 36:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _parseI3SNodeGeometry.apply(this, arguments);
}
function updateAttributesMetadata(attributes, decompressedGeometry) {
  for (var key in decompressedGeometry.loaderData.attributes) {
    var dracoAttribute = decompressedGeometry.loaderData.attributes[key];
    switch (dracoAttribute.name) {
      case 'POSITION':
        attributes.position.metadata = dracoAttribute.metadata;
        break;
      case 'feature-index':
        attributes.id.metadata = dracoAttribute.metadata;
        break;
      default:
        break;
    }
  }
}
function concatAttributes(normalizedVertexAttributes, normalizedFeatureAttributes) {
  return _objectSpread(_objectSpread({}, normalizedVertexAttributes), normalizedFeatureAttributes);
}
function normalizeAttribute(attribute) {
  if (!attribute) {
    return attribute;
  }
  attribute.normalized = true;
  return attribute;
}
function parseHeaders(arrayBuffer, options) {
  var byteOffset = 0;
  var vertexCount = 0;
  var featureCount = 0;
  var _iterator = _createForOfIteratorHelper(options.store.defaultGeometrySchema.header),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
        property = _step$value.property,
        type = _step$value.type;
      var TypedArrayTypeHeader = (0, _constants.getConstructorForDataFormat)(type);
      switch (property) {
        case _types.HeaderAttributeProperty.vertexCount:
          vertexCount = new TypedArrayTypeHeader(arrayBuffer, 0, 4)[0];
          byteOffset += (0, _constants.sizeOf)(type);
          break;
        case _types.HeaderAttributeProperty.featureCount:
          featureCount = new TypedArrayTypeHeader(arrayBuffer, 4, 4)[0];
          byteOffset += (0, _constants.sizeOf)(type);
          break;
        default:
          break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    vertexCount: vertexCount,
    featureCount: featureCount,
    byteOffset: byteOffset
  };
}
function normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, attributeCount, attributesOrder) {
  var attributes = {};
  var _iterator2 = _createForOfIteratorHelper(attributesOrder),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var attribute = _step2.value;
      if (vertexAttributes[attribute]) {
        var _vertexAttributes$att = vertexAttributes[attribute],
          valueType = _vertexAttributes$att.valueType,
          valuesPerElement = _vertexAttributes$att.valuesPerElement;
        if (byteOffset + attributeCount * valuesPerElement * (0, _constants.sizeOf)(valueType) <= arrayBuffer.byteLength) {
          var buffer = arrayBuffer.slice(byteOffset);
          var value = void 0;
          if (valueType === 'UInt64') {
            value = parseUint64Values(buffer, attributeCount * valuesPerElement, (0, _constants.sizeOf)(valueType));
          } else {
            var TypedArrayType = (0, _constants.getConstructorForDataFormat)(valueType);
            value = new TypedArrayType(buffer, 0, attributeCount * valuesPerElement);
          }
          attributes[attribute] = {
            value: value,
            type: _constants.GL_TYPE_MAP[valueType],
            size: valuesPerElement
          };
          switch (attribute) {
            case 'color':
              attributes.color.normalized = true;
              break;
            case 'position':
            case 'region':
            case 'normal':
            default:
          }
          byteOffset = byteOffset + attributeCount * valuesPerElement * (0, _constants.sizeOf)(valueType);
        } else if (attribute !== 'uv0') {
          break;
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return {
    attributes: attributes,
    byteOffset: byteOffset
  };
}
function parseUint64Values(buffer, elementsCount, attributeSize) {
  var values = [];
  var dataView = new DataView(buffer);
  var offset = 0;
  for (var index = 0; index < elementsCount; index++) {
    var left = dataView.getUint32(offset, true);
    var right = dataView.getUint32(offset + 4, true);
    var value = left + Math.pow(2, 32) * right;
    values.push(value);
    offset += attributeSize;
  }
  return new Uint32Array(values);
}
function parsePositions(attribute, options) {
  var mbs = options.mbs;
  var value = attribute.value;
  var metadata = attribute.metadata;
  var enuMatrix = new _core2.Matrix4();
  var cartographicOrigin = new _core2.Vector3(mbs[0], mbs[1], mbs[2]);
  var cartesianOrigin = new _core2.Vector3();
  _geospatial.Ellipsoid.WGS84.cartographicToCartesian(cartographicOrigin, cartesianOrigin);
  _geospatial.Ellipsoid.WGS84.eastNorthUpToFixedFrame(cartesianOrigin, enuMatrix);
  attribute.value = offsetsToCartesians(value, metadata, cartographicOrigin);
  return enuMatrix;
}
function offsetsToCartesians(vertices) {
  var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cartographicOrigin = arguments.length > 2 ? arguments[2] : undefined;
  var positions = new Float64Array(vertices.length);
  var scaleX = metadata['i3s-scale_x'] && metadata['i3s-scale_x'].double || 1;
  var scaleY = metadata['i3s-scale_y'] && metadata['i3s-scale_y'].double || 1;
  for (var i = 0; i < positions.length; i += 3) {
    positions[i] = vertices[i] * scaleX + cartographicOrigin.x;
    positions[i + 1] = vertices[i + 1] * scaleY + cartographicOrigin.y;
    positions[i + 2] = vertices[i + 2] + cartographicOrigin.z;
  }
  for (var _i = 0; _i < positions.length; _i += 3) {
    _geospatial.Ellipsoid.WGS84.cartographicToCartesian(positions.subarray(_i, _i + 3), scratchVector);
    positions[_i] = scratchVector.x;
    positions[_i + 1] = scratchVector.y;
    positions[_i + 2] = scratchVector.z;
  }
  return positions;
}
function getModelMatrix(positions) {
  var _metadata$i3sScale_x, _metadata$i3sScale_y;
  var metadata = positions.metadata;
  var scaleX = (metadata === null || metadata === void 0 ? void 0 : (_metadata$i3sScale_x = metadata['i3s-scale_x']) === null || _metadata$i3sScale_x === void 0 ? void 0 : _metadata$i3sScale_x.double) || 1;
  var scaleY = (metadata === null || metadata === void 0 ? void 0 : (_metadata$i3sScale_y = metadata['i3s-scale_y']) === null || _metadata$i3sScale_y === void 0 ? void 0 : _metadata$i3sScale_y.double) || 1;
  var modelMatrix = new _core2.Matrix4();
  modelMatrix[0] = scaleX;
  modelMatrix[5] = scaleY;
  return modelMatrix;
}
function makePbrMaterial(materialDefinition, texture) {
  var pbrMaterial;
  if (materialDefinition) {
    pbrMaterial = _objectSpread(_objectSpread({}, materialDefinition), {}, {
      pbrMetallicRoughness: materialDefinition.pbrMetallicRoughness ? _objectSpread({}, materialDefinition.pbrMetallicRoughness) : {
        baseColorFactor: [255, 255, 255, 255]
      }
    });
  } else {
    pbrMaterial = {
      pbrMetallicRoughness: {}
    };
    if (texture) {
      pbrMaterial.pbrMetallicRoughness.baseColorTexture = {
        texCoord: 0
      };
    } else {
      pbrMaterial.pbrMetallicRoughness.baseColorFactor = [255, 255, 255, 255];
    }
  }
  pbrMaterial.alphaCutoff = pbrMaterial.alphaCutoff || 0.25;
  if (pbrMaterial.alphaMode) {
    pbrMaterial.alphaMode = pbrMaterial.alphaMode.toUpperCase();
  }
  if (pbrMaterial.emissiveFactor) {
    pbrMaterial.emissiveFactor = convertColorFormat(pbrMaterial.emissiveFactor);
  }
  if (pbrMaterial.pbrMetallicRoughness && pbrMaterial.pbrMetallicRoughness.baseColorFactor) {
    pbrMaterial.pbrMetallicRoughness.baseColorFactor = convertColorFormat(pbrMaterial.pbrMetallicRoughness.baseColorFactor);
  }
  if (texture) {
    setMaterialTexture(pbrMaterial, texture);
  }
  return pbrMaterial;
}
function convertColorFormat(colorFactor) {
  var normalizedColor = (0, _toConsumableArray2.default)(colorFactor);
  for (var index = 0; index < colorFactor.length; index++) {
    normalizedColor[index] = colorFactor[index] / 255;
  }
  return normalizedColor;
}
function setMaterialTexture(material, image) {
  var texture = {
    source: {
      image: image
    }
  };
  if (material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture) {
    material.pbrMetallicRoughness.baseColorTexture = _objectSpread(_objectSpread({}, material.pbrMetallicRoughness.baseColorTexture), {}, {
      texture: texture
    });
  } else if (material.emissiveTexture) {
    material.emissiveTexture = _objectSpread(_objectSpread({}, material.emissiveTexture), {}, {
      texture: texture
    });
  } else if (material.pbrMetallicRoughness && material.pbrMetallicRoughness.metallicRoughnessTexture) {
    material.pbrMetallicRoughness.metallicRoughnessTexture = _objectSpread(_objectSpread({}, material.pbrMetallicRoughness.metallicRoughnessTexture), {}, {
      texture: texture
    });
  } else if (material.normalTexture) {
    material.normalTexture = _objectSpread(_objectSpread({}, material.normalTexture), {}, {
      texture: texture
    });
  } else if (material.occlusionTexture) {
    material.occlusionTexture = _objectSpread(_objectSpread({}, material.occlusionTexture), {}, {
      texture: texture
    });
  }
}
function flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes) {
  var id = normalizedFeatureAttributes.id,
    faceRange = normalizedFeatureAttributes.faceRange;
  if (!id || !faceRange) {
    return;
  }
  var featureIds = id.value;
  var range = faceRange.value;
  var featureIdsLength = range[range.length - 1] + 1;
  var orderedFeatureIndices = new Uint32Array(featureIdsLength * 3);
  var featureIndex = 0;
  var startIndex = 0;
  for (var index = 1; index < range.length; index += 2) {
    var fillId = Number(featureIds[featureIndex]);
    var endValue = range[index];
    var prevValue = range[index - 1];
    var trianglesCount = endValue - prevValue + 1;
    var endIndex = startIndex + trianglesCount * 3;
    orderedFeatureIndices.fill(fillId, startIndex, endIndex);
    featureIndex++;
    startIndex = endIndex;
  }
  normalizedFeatureAttributes.id.value = orderedFeatureIndices;
}
function flattenFeatureIdsByFeatureIndices(attributes, featureIds) {
  var featureIndices = attributes.id.value;
  var result = new Float32Array(featureIndices.length);
  for (var index = 0; index < featureIndices.length; index++) {
    result[index] = featureIds[featureIndices[index]];
  }
  attributes.id.value = result;
}
function getFeatureIdsFromFeatureIndexMetadata(featureIndex) {
  var _featureIndex$metadat, _featureIndex$metadat2;
  return featureIndex === null || featureIndex === void 0 ? void 0 : (_featureIndex$metadat = featureIndex.metadata) === null || _featureIndex$metadat === void 0 ? void 0 : (_featureIndex$metadat2 = _featureIndex$metadat['i3s-feature-ids']) === null || _featureIndex$metadat2 === void 0 ? void 0 : _featureIndex$metadat2.intArray;
}
//# sourceMappingURL=parse-i3s-tile-content.js.map