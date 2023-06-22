import { load, parse } from '@loaders.gl/core';
import { Vector3, Matrix4 } from '@math.gl/core';
import { Ellipsoid } from '@math.gl/geospatial';
import { ImageLoader } from '@loaders.gl/images';
import { DracoLoader } from '@loaders.gl/draco';
import { BasisLoader, CompressedTextureLoader } from '@loaders.gl/textures';
import { HeaderAttributeProperty } from '../../types';
import { getUrlWithToken } from '../utils/url-utils';
import { GL_TYPE_MAP, getConstructorForDataFormat, sizeOf, COORDINATE_SYSTEM } from './constants';
import { customizeColors } from '../utils/customizeColors';
const scratchVector = new Vector3([0, 0, 0]);
function getLoaderForTextureFormat(textureFormat) {
  switch (textureFormat) {
    case 'ktx-etc2':
    case 'dds':
      return CompressedTextureLoader;
    case 'ktx2':
      return BasisLoader;
    case 'jpg':
    case 'png':
    default:
      return ImageLoader;
  }
}
const I3S_ATTRIBUTE_TYPE = 'i3s-attribute-type';
export async function parseI3STileContent(arrayBuffer, tileOptions, tilesetOptions, options, context) {
  const content = {
    attributes: {},
    indices: null,
    featureIds: [],
    vertexCount: 0,
    modelMatrix: new Matrix4(),
    coordinateSystem: 0,
    byteLength: 0,
    texture: null
  };
  if (tileOptions.textureUrl) {
    var _options$i3s;
    const url = getUrlWithToken(tileOptions.textureUrl, options === null || options === void 0 ? void 0 : (_options$i3s = options.i3s) === null || _options$i3s === void 0 ? void 0 : _options$i3s.token);
    const loader = getLoaderForTextureFormat(tileOptions.textureFormat);
    const response = await fetch(url, options === null || options === void 0 ? void 0 : options.fetch);
    const arrayBuffer = await response.arrayBuffer();
    if (options !== null && options !== void 0 && options.i3s.decodeTextures) {
      if (loader === ImageLoader) {
        const options = {
          ...tileOptions.textureLoaderOptions,
          image: {
            type: 'data'
          }
        };
        try {
          content.texture = await context.parse(arrayBuffer, options);
        } catch (e) {
          content.texture = await parse(arrayBuffer, loader, options);
        }
      } else if (loader === CompressedTextureLoader || loader === BasisLoader) {
        let texture = await load(arrayBuffer, loader, tileOptions.textureLoaderOptions);
        if (loader === BasisLoader) {
          texture = texture[0];
        }
        content.texture = {
          compressed: true,
          mipmaps: false,
          width: texture[0].width,
          height: texture[0].height,
          data: texture
        };
      }
    } else {
      content.texture = arrayBuffer;
    }
  }
  content.material = makePbrMaterial(tileOptions.materialDefinition, content.texture);
  if (content.material) {
    content.texture = null;
  }
  return await parseI3SNodeGeometry(arrayBuffer, content, tileOptions, tilesetOptions, options);
}
async function parseI3SNodeGeometry(arrayBuffer, content, tileOptions, tilesetOptions, options) {
  var _options$i3s2;
  const contentByteLength = arrayBuffer.byteLength;
  let attributes;
  let vertexCount;
  let byteOffset = 0;
  let featureCount = 0;
  let indices;
  if (tileOptions.isDracoGeometry) {
    var _decompressedGeometry;
    const decompressedGeometry = await parse(arrayBuffer, DracoLoader, {
      draco: {
        attributeNameEntry: I3S_ATTRIBUTE_TYPE
      }
    });
    vertexCount = decompressedGeometry.header.vertexCount;
    indices = (_decompressedGeometry = decompressedGeometry.indices) === null || _decompressedGeometry === void 0 ? void 0 : _decompressedGeometry.value;
    const {
      POSITION,
      NORMAL,
      COLOR_0,
      TEXCOORD_0,
      ['feature-index']: featureIndex,
      ['uv-region']: uvRegion
    } = decompressedGeometry.attributes;
    attributes = {
      position: POSITION,
      normal: NORMAL,
      color: COLOR_0,
      uv0: TEXCOORD_0,
      uvRegion,
      id: featureIndex
    };
    updateAttributesMetadata(attributes, decompressedGeometry);
    const featureIds = getFeatureIdsFromFeatureIndexMetadata(featureIndex);
    if (featureIds) {
      flattenFeatureIdsByFeatureIndices(attributes, featureIds);
    }
  } else {
    const {
      vertexAttributes,
      ordering: attributesOrder,
      featureAttributes,
      featureAttributeOrder
    } = tilesetOptions.store.defaultGeometrySchema;
    const headers = parseHeaders(arrayBuffer, tilesetOptions);
    byteOffset = headers.byteOffset;
    vertexCount = headers.vertexCount;
    featureCount = headers.featureCount;
    const {
      attributes: normalizedVertexAttributes,
      byteOffset: offset
    } = normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, vertexCount, attributesOrder);
    const {
      attributes: normalizedFeatureAttributes
    } = normalizeAttributes(arrayBuffer, offset, featureAttributes, featureCount, featureAttributeOrder);
    flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes);
    attributes = concatAttributes(normalizedVertexAttributes, normalizedFeatureAttributes);
  }
  if (!(options !== null && options !== void 0 && (_options$i3s2 = options.i3s) !== null && _options$i3s2 !== void 0 && _options$i3s2.coordinateSystem) || options.i3s.coordinateSystem === COORDINATE_SYSTEM.METER_OFFSETS) {
    const enuMatrix = parsePositions(attributes.position, tileOptions);
    content.modelMatrix = enuMatrix.invert();
    content.coordinateSystem = COORDINATE_SYSTEM.METER_OFFSETS;
  } else {
    content.modelMatrix = getModelMatrix(attributes.position);
    content.coordinateSystem = COORDINATE_SYSTEM.LNGLAT_OFFSETS;
  }
  attributes.color = await customizeColors(attributes.color, attributes.id, tileOptions, tilesetOptions, options);
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
  for (const attributeIndex in content.attributes) {
    if (!content.attributes[attributeIndex]) {
      delete content.attributes[attributeIndex];
    }
  }
  content.vertexCount = vertexCount;
  content.byteLength = contentByteLength;
  return content;
}
function updateAttributesMetadata(attributes, decompressedGeometry) {
  for (const key in decompressedGeometry.loaderData.attributes) {
    const dracoAttribute = decompressedGeometry.loaderData.attributes[key];
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
  return {
    ...normalizedVertexAttributes,
    ...normalizedFeatureAttributes
  };
}
function normalizeAttribute(attribute) {
  if (!attribute) {
    return attribute;
  }
  attribute.normalized = true;
  return attribute;
}
function parseHeaders(arrayBuffer, options) {
  let byteOffset = 0;
  let vertexCount = 0;
  let featureCount = 0;
  for (const {
    property,
    type
  } of options.store.defaultGeometrySchema.header) {
    const TypedArrayTypeHeader = getConstructorForDataFormat(type);
    switch (property) {
      case HeaderAttributeProperty.vertexCount:
        vertexCount = new TypedArrayTypeHeader(arrayBuffer, 0, 4)[0];
        byteOffset += sizeOf(type);
        break;
      case HeaderAttributeProperty.featureCount:
        featureCount = new TypedArrayTypeHeader(arrayBuffer, 4, 4)[0];
        byteOffset += sizeOf(type);
        break;
      default:
        break;
    }
  }
  return {
    vertexCount,
    featureCount,
    byteOffset
  };
}
function normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, attributeCount, attributesOrder) {
  const attributes = {};
  for (const attribute of attributesOrder) {
    if (vertexAttributes[attribute]) {
      const {
        valueType,
        valuesPerElement
      } = vertexAttributes[attribute];
      if (byteOffset + attributeCount * valuesPerElement * sizeOf(valueType) <= arrayBuffer.byteLength) {
        const buffer = arrayBuffer.slice(byteOffset);
        let value;
        if (valueType === 'UInt64') {
          value = parseUint64Values(buffer, attributeCount * valuesPerElement, sizeOf(valueType));
        } else {
          const TypedArrayType = getConstructorForDataFormat(valueType);
          value = new TypedArrayType(buffer, 0, attributeCount * valuesPerElement);
        }
        attributes[attribute] = {
          value,
          type: GL_TYPE_MAP[valueType],
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
        byteOffset = byteOffset + attributeCount * valuesPerElement * sizeOf(valueType);
      } else if (attribute !== 'uv0') {
        break;
      }
    }
  }
  return {
    attributes,
    byteOffset
  };
}
function parseUint64Values(buffer, elementsCount, attributeSize) {
  const values = [];
  const dataView = new DataView(buffer);
  let offset = 0;
  for (let index = 0; index < elementsCount; index++) {
    const left = dataView.getUint32(offset, true);
    const right = dataView.getUint32(offset + 4, true);
    const value = left + 2 ** 32 * right;
    values.push(value);
    offset += attributeSize;
  }
  return new Uint32Array(values);
}
function parsePositions(attribute, options) {
  const mbs = options.mbs;
  const value = attribute.value;
  const metadata = attribute.metadata;
  const enuMatrix = new Matrix4();
  const cartographicOrigin = new Vector3(mbs[0], mbs[1], mbs[2]);
  const cartesianOrigin = new Vector3();
  Ellipsoid.WGS84.cartographicToCartesian(cartographicOrigin, cartesianOrigin);
  Ellipsoid.WGS84.eastNorthUpToFixedFrame(cartesianOrigin, enuMatrix);
  attribute.value = offsetsToCartesians(value, metadata, cartographicOrigin);
  return enuMatrix;
}
function offsetsToCartesians(vertices) {
  let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let cartographicOrigin = arguments.length > 2 ? arguments[2] : undefined;
  const positions = new Float64Array(vertices.length);
  const scaleX = metadata['i3s-scale_x'] && metadata['i3s-scale_x'].double || 1;
  const scaleY = metadata['i3s-scale_y'] && metadata['i3s-scale_y'].double || 1;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = vertices[i] * scaleX + cartographicOrigin.x;
    positions[i + 1] = vertices[i + 1] * scaleY + cartographicOrigin.y;
    positions[i + 2] = vertices[i + 2] + cartographicOrigin.z;
  }
  for (let i = 0; i < positions.length; i += 3) {
    Ellipsoid.WGS84.cartographicToCartesian(positions.subarray(i, i + 3), scratchVector);
    positions[i] = scratchVector.x;
    positions[i + 1] = scratchVector.y;
    positions[i + 2] = scratchVector.z;
  }
  return positions;
}
function getModelMatrix(positions) {
  var _metadata$i3sScale_x, _metadata$i3sScale_y;
  const metadata = positions.metadata;
  const scaleX = (metadata === null || metadata === void 0 ? void 0 : (_metadata$i3sScale_x = metadata['i3s-scale_x']) === null || _metadata$i3sScale_x === void 0 ? void 0 : _metadata$i3sScale_x.double) || 1;
  const scaleY = (metadata === null || metadata === void 0 ? void 0 : (_metadata$i3sScale_y = metadata['i3s-scale_y']) === null || _metadata$i3sScale_y === void 0 ? void 0 : _metadata$i3sScale_y.double) || 1;
  const modelMatrix = new Matrix4();
  modelMatrix[0] = scaleX;
  modelMatrix[5] = scaleY;
  return modelMatrix;
}
function makePbrMaterial(materialDefinition, texture) {
  let pbrMaterial;
  if (materialDefinition) {
    pbrMaterial = {
      ...materialDefinition,
      pbrMetallicRoughness: materialDefinition.pbrMetallicRoughness ? {
        ...materialDefinition.pbrMetallicRoughness
      } : {
        baseColorFactor: [255, 255, 255, 255]
      }
    };
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
  const normalizedColor = [...colorFactor];
  for (let index = 0; index < colorFactor.length; index++) {
    normalizedColor[index] = colorFactor[index] / 255;
  }
  return normalizedColor;
}
function setMaterialTexture(material, image) {
  const texture = {
    source: {
      image
    }
  };
  if (material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture) {
    material.pbrMetallicRoughness.baseColorTexture = {
      ...material.pbrMetallicRoughness.baseColorTexture,
      texture
    };
  } else if (material.emissiveTexture) {
    material.emissiveTexture = {
      ...material.emissiveTexture,
      texture
    };
  } else if (material.pbrMetallicRoughness && material.pbrMetallicRoughness.metallicRoughnessTexture) {
    material.pbrMetallicRoughness.metallicRoughnessTexture = {
      ...material.pbrMetallicRoughness.metallicRoughnessTexture,
      texture
    };
  } else if (material.normalTexture) {
    material.normalTexture = {
      ...material.normalTexture,
      texture
    };
  } else if (material.occlusionTexture) {
    material.occlusionTexture = {
      ...material.occlusionTexture,
      texture
    };
  }
}
function flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes) {
  const {
    id,
    faceRange
  } = normalizedFeatureAttributes;
  if (!id || !faceRange) {
    return;
  }
  const featureIds = id.value;
  const range = faceRange.value;
  const featureIdsLength = range[range.length - 1] + 1;
  const orderedFeatureIndices = new Uint32Array(featureIdsLength * 3);
  let featureIndex = 0;
  let startIndex = 0;
  for (let index = 1; index < range.length; index += 2) {
    const fillId = Number(featureIds[featureIndex]);
    const endValue = range[index];
    const prevValue = range[index - 1];
    const trianglesCount = endValue - prevValue + 1;
    const endIndex = startIndex + trianglesCount * 3;
    orderedFeatureIndices.fill(fillId, startIndex, endIndex);
    featureIndex++;
    startIndex = endIndex;
  }
  normalizedFeatureAttributes.id.value = orderedFeatureIndices;
}
function flattenFeatureIdsByFeatureIndices(attributes, featureIds) {
  const featureIndices = attributes.id.value;
  const result = new Float32Array(featureIndices.length);
  for (let index = 0; index < featureIndices.length; index++) {
    result[index] = featureIds[featureIndices[index]];
  }
  attributes.id.value = result;
}
function getFeatureIdsFromFeatureIndexMetadata(featureIndex) {
  var _featureIndex$metadat, _featureIndex$metadat2;
  return featureIndex === null || featureIndex === void 0 ? void 0 : (_featureIndex$metadat = featureIndex.metadata) === null || _featureIndex$metadat === void 0 ? void 0 : (_featureIndex$metadat2 = _featureIndex$metadat['i3s-feature-ids']) === null || _featureIndex$metadat2 === void 0 ? void 0 : _featureIndex$metadat2.intArray;
}
//# sourceMappingURL=parse-i3s-tile-content.js.map