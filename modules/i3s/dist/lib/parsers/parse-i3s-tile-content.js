"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseI3STileContent = void 0;
const core_1 = require("@loaders.gl/core");
const core_2 = require("@math.gl/core");
const geospatial_1 = require("@math.gl/geospatial");
const images_1 = require("@loaders.gl/images");
const draco_1 = require("@loaders.gl/draco");
const textures_1 = require("@loaders.gl/textures");
const types_1 = require("../../types");
const url_utils_1 = require("../utils/url-utils");
const constants_1 = require("./constants");
const customizeColors_1 = require("../utils/customizeColors");
const scratchVector = new core_2.Vector3([0, 0, 0]);
function getLoaderForTextureFormat(textureFormat) {
    switch (textureFormat) {
        case 'ktx-etc2':
        case 'dds':
            return textures_1.CompressedTextureLoader;
        case 'ktx2':
            return textures_1.BasisLoader;
        case 'jpg':
        case 'png':
        default:
            return images_1.ImageLoader;
    }
}
const I3S_ATTRIBUTE_TYPE = 'i3s-attribute-type';
async function parseI3STileContent(arrayBuffer, tileOptions, tilesetOptions, options, context) {
    const content = {
        attributes: {},
        indices: null,
        featureIds: [],
        vertexCount: 0,
        modelMatrix: new core_2.Matrix4(),
        coordinateSystem: 0,
        byteLength: 0,
        texture: null
    };
    if (tileOptions.textureUrl) {
        // @ts-expect-error options is not properly typed
        const url = (0, url_utils_1.getUrlWithToken)(tileOptions.textureUrl, options?.i3s?.token);
        const loader = getLoaderForTextureFormat(tileOptions.textureFormat);
        const response = await fetch(url, options?.fetch);
        const arrayBuffer = await response.arrayBuffer();
        // @ts-expect-error options is not properly typed
        if (options?.i3s.decodeTextures) {
            if (loader === images_1.ImageLoader) {
                const options = { ...tileOptions.textureLoaderOptions, image: { type: 'data' } };
                try {
                    // @ts-ignore context must be defined
                    // Image constructor is not supported in worker thread.
                    // Do parsing image data on the main thread by using context to avoid worker issues.
                    content.texture = await context.parse(arrayBuffer, options);
                }
                catch (e) {
                    // context object is different between worker and node.js conversion script.
                    // To prevent error we parse data in ordinary way if it is not parsed by using context.
                    // @ts-expect-error
                    content.texture = await (0, core_1.parse)(arrayBuffer, loader, options);
                }
            }
            else if (loader === textures_1.CompressedTextureLoader || loader === textures_1.BasisLoader) {
                let texture = await (0, core_1.load)(arrayBuffer, loader, tileOptions.textureLoaderOptions);
                if (loader === textures_1.BasisLoader) {
                    // @ts-expect-error
                    texture = texture[0];
                }
                content.texture = {
                    compressed: true,
                    mipmaps: false,
                    // @ts-expect-error
                    width: texture[0].width,
                    // @ts-expect-error
                    height: texture[0].height,
                    // @ts-expect-error
                    data: texture
                };
            }
        }
        else {
            content.texture = arrayBuffer;
        }
    }
    content.material = makePbrMaterial(tileOptions.materialDefinition, content.texture);
    if (content.material) {
        content.texture = null;
    }
    return await parseI3SNodeGeometry(arrayBuffer, content, tileOptions, tilesetOptions, options);
}
exports.parseI3STileContent = parseI3STileContent;
/* eslint-disable max-statements */
async function parseI3SNodeGeometry(arrayBuffer, content, tileOptions, tilesetOptions, options) {
    const contentByteLength = arrayBuffer.byteLength;
    let attributes;
    let vertexCount;
    let byteOffset = 0;
    let featureCount = 0;
    let indices;
    if (tileOptions.isDracoGeometry) {
        const decompressedGeometry = await (0, core_1.parse)(arrayBuffer, draco_1.DracoLoader, {
            draco: {
                attributeNameEntry: I3S_ATTRIBUTE_TYPE
            }
        });
        // @ts-expect-error
        vertexCount = decompressedGeometry.header.vertexCount;
        indices = decompressedGeometry.indices?.value;
        const { POSITION, NORMAL, COLOR_0, TEXCOORD_0, ['feature-index']: featureIndex, ['uv-region']: uvRegion } = decompressedGeometry.attributes;
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
    }
    else {
        const { vertexAttributes, ordering: attributesOrder, featureAttributes, featureAttributeOrder } = tilesetOptions.store.defaultGeometrySchema;
        // First 8 bytes reserved for header (vertexCount and featureCount)
        const headers = parseHeaders(arrayBuffer, tilesetOptions);
        byteOffset = headers.byteOffset;
        vertexCount = headers.vertexCount;
        featureCount = headers.featureCount;
        // Getting vertex attributes such as positions, normals, colors, etc...
        const { attributes: normalizedVertexAttributes, byteOffset: offset } = normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, vertexCount, attributesOrder);
        // Getting feature attributes such as featureIds and faceRange
        const { attributes: normalizedFeatureAttributes } = normalizeAttributes(arrayBuffer, offset, featureAttributes, featureCount, featureAttributeOrder);
        flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes);
        attributes = concatAttributes(normalizedVertexAttributes, normalizedFeatureAttributes);
    }
    if (!options?.i3s?.coordinateSystem ||
        options.i3s.coordinateSystem === constants_1.COORDINATE_SYSTEM.METER_OFFSETS) {
        const enuMatrix = parsePositions(attributes.position, tileOptions);
        content.modelMatrix = enuMatrix.invert();
        content.coordinateSystem = constants_1.COORDINATE_SYSTEM.METER_OFFSETS;
    }
    else {
        content.modelMatrix = getModelMatrix(attributes.position);
        content.coordinateSystem = constants_1.COORDINATE_SYSTEM.LNGLAT_OFFSETS;
    }
    attributes.color = await (0, customizeColors_1.customizeColors)(attributes.color, attributes.id, tileOptions, tilesetOptions, options);
    content.attributes = {
        positions: attributes.position,
        normals: attributes.normal,
        colors: normalizeAttribute(attributes.color),
        texCoords: attributes.uv0,
        uvRegions: normalizeAttribute(attributes.uvRegion || attributes.region) // Normalize from UInt16
    };
    content.indices = indices || null;
    if (attributes.id && attributes.id.value) {
        content.featureIds = attributes.id.value;
    }
    // Remove undefined attributes
    for (const attributeIndex in content.attributes) {
        if (!content.attributes[attributeIndex]) {
            delete content.attributes[attributeIndex];
        }
    }
    content.vertexCount = vertexCount;
    content.byteLength = contentByteLength;
    return content;
}
/**
 * Update attributes with metadata from decompressed geometry.
 * @param decompressedGeometry
 * @param attributes
 */
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
/**
 * Do concatenation of attribute objects.
 * Done as separate fucntion to avoid ts errors.
 * @param normalizedVertexAttributes
 * @param normalizedFeatureAttributes
 * @returns - result of attributes concatenation.
 */
function concatAttributes(normalizedVertexAttributes, normalizedFeatureAttributes) {
    return { ...normalizedVertexAttributes, ...normalizedFeatureAttributes };
}
/**
 * Normalize attribute to range [0..1] . Eg. convert colors buffer from [255,255,255,255] to [1,1,1,1]
 * @param attribute - geometry attribute
 * @returns - geometry attribute in right format
 */
function normalizeAttribute(attribute) {
    if (!attribute) {
        return attribute;
    }
    attribute.normalized = true;
    return attribute;
}
function parseHeaders(arrayBuffer, options) {
    let byteOffset = 0;
    // First 8 bytes reserved for header (vertexCount and featurecount)
    let vertexCount = 0;
    let featureCount = 0;
    for (const { property, type } of options.store.defaultGeometrySchema.header) {
        const TypedArrayTypeHeader = (0, constants_1.getConstructorForDataFormat)(type);
        switch (property) {
            case types_1.HeaderAttributeProperty.vertexCount:
                vertexCount = new TypedArrayTypeHeader(arrayBuffer, 0, 4)[0];
                byteOffset += (0, constants_1.sizeOf)(type);
                break;
            case types_1.HeaderAttributeProperty.featureCount:
                featureCount = new TypedArrayTypeHeader(arrayBuffer, 4, 4)[0];
                byteOffset += (0, constants_1.sizeOf)(type);
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
/* eslint-enable max-statements */
function normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, attributeCount, attributesOrder) {
    const attributes = {};
    // the order of attributes depend on the order being added to the vertexAttributes object
    for (const attribute of attributesOrder) {
        if (vertexAttributes[attribute]) {
            const { valueType, valuesPerElement } = vertexAttributes[attribute];
            // protect from arrayBuffer read overunns by NOT assuming node has regions always even though its declared in defaultGeometrySchema.
            // In i3s 1.6: client is required to decide that based on ./shared resource of the node (materialDefinitions.[Mat_id].params.vertexRegions == true)
            // In i3s 1.7 the property has been rolled into the 3d scene layer json/node pages.
            // Code below does not account when the bytelength is actually bigger than
            // the calculated value (b\c the tile potentially could have mesh segmentation information).
            // In those cases tiles without regions could fail or have garbage values.
            if (byteOffset + attributeCount * valuesPerElement * (0, constants_1.sizeOf)(valueType) <=
                arrayBuffer.byteLength) {
                const buffer = arrayBuffer.slice(byteOffset);
                let value;
                if (valueType === 'UInt64') {
                    value = parseUint64Values(buffer, attributeCount * valuesPerElement, (0, constants_1.sizeOf)(valueType));
                }
                else {
                    const TypedArrayType = (0, constants_1.getConstructorForDataFormat)(valueType);
                    value = new TypedArrayType(buffer, 0, attributeCount * valuesPerElement);
                }
                attributes[attribute] = {
                    value,
                    type: constants_1.GL_TYPE_MAP[valueType],
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
                byteOffset = byteOffset + attributeCount * valuesPerElement * (0, constants_1.sizeOf)(valueType);
            }
            else if (attribute !== 'uv0') {
                break;
            }
        }
    }
    return { attributes, byteOffset };
}
/**
 * Parse buffer to return array of uint64 values
 *
 * @param buffer
 * @param elementsCount
 * @returns 64-bit array of values until precision is lost after Number.MAX_SAFE_INTEGER
 */
function parseUint64Values(buffer, elementsCount, attributeSize) {
    const values = [];
    const dataView = new DataView(buffer);
    let offset = 0;
    for (let index = 0; index < elementsCount; index++) {
        // split 64-bit number into two 32-bit parts
        const left = dataView.getUint32(offset, true);
        const right = dataView.getUint32(offset + 4, true);
        // combine the two 32-bit values
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
    const enuMatrix = new core_2.Matrix4();
    const cartographicOrigin = new core_2.Vector3(mbs[0], mbs[1], mbs[2]);
    const cartesianOrigin = new core_2.Vector3();
    geospatial_1.Ellipsoid.WGS84.cartographicToCartesian(cartographicOrigin, cartesianOrigin);
    geospatial_1.Ellipsoid.WGS84.eastNorthUpToFixedFrame(cartesianOrigin, enuMatrix);
    attribute.value = offsetsToCartesians(value, metadata, cartographicOrigin);
    return enuMatrix;
}
/**
 * Converts position coordinates to absolute cartesian coordinates
 * @param vertices - "position" attribute data
 * @param metadata - When the geometry is DRACO compressed, contain position attribute's metadata
 *  https://github.com/Esri/i3s-spec/blob/master/docs/1.7/compressedAttributes.cmn.md
 * @param cartographicOrigin - Cartographic origin coordinates
 * @returns - converted "position" data
 */
function offsetsToCartesians(vertices, metadata = {}, cartographicOrigin) {
    const positions = new Float64Array(vertices.length);
    const scaleX = (metadata['i3s-scale_x'] && metadata['i3s-scale_x'].double) || 1;
    const scaleY = (metadata['i3s-scale_y'] && metadata['i3s-scale_y'].double) || 1;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] = vertices[i] * scaleX + cartographicOrigin.x;
        positions[i + 1] = vertices[i + 1] * scaleY + cartographicOrigin.y;
        positions[i + 2] = vertices[i + 2] + cartographicOrigin.z;
    }
    for (let i = 0; i < positions.length; i += 3) {
        // @ts-ignore
        geospatial_1.Ellipsoid.WGS84.cartographicToCartesian(positions.subarray(i, i + 3), scratchVector);
        positions[i] = scratchVector.x;
        positions[i + 1] = scratchVector.y;
        positions[i + 2] = scratchVector.z;
    }
    return positions;
}
/**
 * Get model matrix for loaded vertices
 * @param positions positions attribute
 * @returns Matrix4 - model matrix for geometry transformation
 */
function getModelMatrix(positions) {
    const metadata = positions.metadata;
    const scaleX = metadata?.['i3s-scale_x']?.double || 1;
    const scaleY = metadata?.['i3s-scale_y']?.double || 1;
    const modelMatrix = new core_2.Matrix4();
    modelMatrix[0] = scaleX;
    modelMatrix[5] = scaleY;
    return modelMatrix;
}
/**
 * Makes a glTF-compatible PBR material from an I3S material definition
 * @param materialDefinition - i3s material definition
 *  https://github.com/Esri/i3s-spec/blob/master/docs/1.7/materialDefinitions.cmn.md
 * @param texture - texture image
 * @returns {object}
 */
function makePbrMaterial(materialDefinition, texture) {
    let pbrMaterial;
    if (materialDefinition) {
        pbrMaterial = {
            ...materialDefinition,
            pbrMetallicRoughness: materialDefinition.pbrMetallicRoughness
                ? { ...materialDefinition.pbrMetallicRoughness }
                : { baseColorFactor: [255, 255, 255, 255] }
        };
    }
    else {
        pbrMaterial = {
            pbrMetallicRoughness: {}
        };
        if (texture) {
            pbrMaterial.pbrMetallicRoughness.baseColorTexture = { texCoord: 0 };
        }
        else {
            pbrMaterial.pbrMetallicRoughness.baseColorFactor = [255, 255, 255, 255];
        }
    }
    // Set default 0.25 per spec https://github.com/Esri/i3s-spec/blob/master/docs/1.7/materialDefinitions.cmn.md
    pbrMaterial.alphaCutoff = pbrMaterial.alphaCutoff || 0.25;
    if (pbrMaterial.alphaMode) {
        // I3S contain alphaMode in lowerCase
        pbrMaterial.alphaMode = pbrMaterial.alphaMode.toUpperCase();
    }
    // Convert colors from [255,255,255,255] to [1,1,1,1]
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
/**
 * Convert color from [255,255,255,255] to [1,1,1,1]
 * @param colorFactor - color array
 * @returns - new color array
 */
function convertColorFormat(colorFactor) {
    const normalizedColor = [...colorFactor];
    for (let index = 0; index < colorFactor.length; index++) {
        normalizedColor[index] = colorFactor[index] / 255;
    }
    return normalizedColor;
}
/**
 * Set texture in PBR material
 * @param {object} material - i3s material definition
 * @param image - texture image
 * @returns
 */
function setMaterialTexture(material, image) {
    const texture = { source: { image } };
    // I3SLoader now support loading only one texture. This elseif sequence will assign this texture to one of
    // properties defined in materialDefinition
    if (material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture) {
        material.pbrMetallicRoughness.baseColorTexture = {
            ...material.pbrMetallicRoughness.baseColorTexture,
            texture
        };
    }
    else if (material.emissiveTexture) {
        material.emissiveTexture = { ...material.emissiveTexture, texture };
    }
    else if (material.pbrMetallicRoughness &&
        material.pbrMetallicRoughness.metallicRoughnessTexture) {
        material.pbrMetallicRoughness.metallicRoughnessTexture = {
            ...material.pbrMetallicRoughness.metallicRoughnessTexture,
            texture
        };
    }
    else if (material.normalTexture) {
        material.normalTexture = { ...material.normalTexture, texture };
    }
    else if (material.occlusionTexture) {
        material.occlusionTexture = { ...material.occlusionTexture, texture };
    }
}
/**
 * Flatten feature ids using face ranges
 * @param normalizedFeatureAttributes
 * @returns
 */
function flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes) {
    const { id, faceRange } = normalizedFeatureAttributes;
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
/**
 * Flatten feature ids using featureIndices
 * @param attributes
 * @param featureIds
 * @returns
 */
function flattenFeatureIdsByFeatureIndices(attributes, featureIds) {
    const featureIndices = attributes.id.value;
    const result = new Float32Array(featureIndices.length);
    for (let index = 0; index < featureIndices.length; index++) {
        result[index] = featureIds[featureIndices[index]];
    }
    attributes.id.value = result;
}
/**
 * Flatten feature ids using featureIndices
 * @param featureIndex
 * @returns
 */
function getFeatureIdsFromFeatureIndexMetadata(featureIndex) {
    return featureIndex?.metadata?.['i3s-feature-ids']?.intArray;
}
