import { Vector3, Matrix4, Vector4 } from '@math.gl/core';
import { Ellipsoid } from '@math.gl/geospatial';
import { DracoWriterWorker } from '@loaders.gl/draco';
import { assert, encode } from '@loaders.gl/core';
import { concatenateArrayBuffers, concatenateTypedArrays } from '@loaders.gl/loader-utils';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import { generateAttributes } from './geometry-attributes';
import { createBoundingVolumesFromGeometry } from './coordinate-converter';
import { prepareDataForAttributesConversion } from './gltf-attributes';
import { handleBatchIdsExtensions } from './batch-ids-extensions';
import { checkPropertiesLength, flattenPropertyTableByFeatureIds } from './feature-attributes';
import { GL } from '@loaders.gl/math';
import { generateSyntheticIndices } from '../../lib/utils/geometry-utils';
const DEFAULT_ROUGHNESS_FACTOR = 1;
const DEFAULT_METALLIC_FACTOR = 1;
const VALUES_PER_VERTEX = 3;
const VALUES_PER_TEX_COORD = 2;
const VALUES_PER_COLOR_ELEMENT = 4;
const STRING_TYPE = 'string';
const SHORT_INT_TYPE = 'Int32';
const DOUBLE_TYPE = 'Float64';
const OBJECT_ID_TYPE = 'Oid32';
const BATCHED_ID_POSSIBLE_ATTRIBUTE_NAMES = ['CUSTOM_ATTRIBUTE_2', '_BATCHID', 'BATCHID'];
const EXT_FEATURE_METADATA = 'EXT_feature_metadata';
const EXT_MESH_FEATURES = 'EXT_mesh_features';
let scratchVector = new Vector3();
export default async function convertB3dmToI3sGeometry(tileContent, addNodeToNodePage, propertyTable, featuresHashArray, attributeStorageInfo, draco, generateBoundingVolumes, shouldMergeMaterials, geoidHeightModel, workerSource) {
  var _tileContent$gltf;
  const useCartesianPositions = generateBoundingVolumes;
  const materialAndTextureList = await convertMaterials((_tileContent$gltf = tileContent.gltf) === null || _tileContent$gltf === void 0 ? void 0 : _tileContent$gltf.materials, shouldMergeMaterials);
  const dataForAttributesConversion = prepareDataForAttributesConversion(tileContent);
  const convertedAttributesMap = await convertAttributes(dataForAttributesConversion, materialAndTextureList, useCartesianPositions);
  if (generateBoundingVolumes) {
    _generateBoundingVolumesFromGeometry(convertedAttributesMap, geoidHeightModel);
  }
  const result = [];
  for (const materialAndTexture of materialAndTextureList) {
    const originarMaterialId = materialAndTexture.mergedMaterials[0].originalMaterialId;
    if (!convertedAttributesMap.has(originarMaterialId)) {
      continue;
    }
    const convertedAttributes = convertedAttributesMap.get(originarMaterialId);
    if (!convertedAttributes) {
      continue;
    }
    const {
      material,
      texture
    } = materialAndTexture;
    const nodeId = await addNodeToNodePage();
    result.push(await _makeNodeResources({
      convertedAttributes,
      material,
      texture,
      tileContent,
      nodeId,
      featuresHashArray,
      propertyTable,
      attributeStorageInfo,
      draco,
      workerSource
    }));
  }
  if (!result.length) {
    return null;
  }
  return result;
}
function _generateBoundingVolumesFromGeometry(convertedAttributesMap, geoidHeightModel) {
  for (const attributes of convertedAttributesMap.values()) {
    const boundingVolumes = createBoundingVolumesFromGeometry(attributes.positions, geoidHeightModel);
    attributes.boundingVolumes = boundingVolumes;
    const cartographicOrigin = boundingVolumes.obb.center;
    for (let index = 0; index < attributes.positions.length; index += VALUES_PER_VERTEX) {
      const vertex = attributes.positions.subarray(index, index + VALUES_PER_VERTEX);
      Ellipsoid.WGS84.cartesianToCartographic(Array.from(vertex), scratchVector);
      scratchVector[2] = scratchVector[2] - geoidHeightModel.getHeight(scratchVector[1], scratchVector[0]);
      scratchVector = scratchVector.subtract(cartographicOrigin);
      attributes.positions.set(scratchVector, index);
    }
  }
}
async function _makeNodeResources(_ref) {
  var _tileContent$gltf2;
  let {
    convertedAttributes,
    material,
    texture,
    tileContent,
    nodeId,
    featuresHashArray,
    propertyTable,
    attributeStorageInfo,
    draco,
    workerSource
  } = _ref;
  const boundingVolumes = convertedAttributes.boundingVolumes;
  const vertexCount = convertedAttributes.positions.length / VALUES_PER_VERTEX;
  const {
    faceRange,
    featureIds,
    positions,
    normals,
    colors,
    uvRegions,
    texCoords,
    featureCount
  } = generateAttributes(convertedAttributes);
  if (tileContent.batchTableJson) {
    makeFeatureIdsUnique(featureIds, convertedAttributes.featureIndices, featuresHashArray, tileContent.batchTableJson);
  }
  const header = new Uint32Array(2);
  const typedFeatureIds = generateBigUint64Array(featureIds);
  header.set([vertexCount, featureCount], 0);
  const fileBuffer = new Uint8Array(concatenateArrayBuffers(header.buffer, positions.buffer, normals.buffer, texture ? texCoords.buffer : new ArrayBuffer(0), colors.buffer, uvRegions, typedFeatureIds.buffer, faceRange.buffer));
  const compressedGeometry = draco ? generateCompressedGeometry(vertexCount, convertedAttributes, {
    positions,
    normals,
    texCoords: texture ? texCoords : new Float32Array(0),
    colors,
    uvRegions,
    featureIds,
    faceRange
  }, workerSource.draco) : null;
  let attributes = [];
  if (attributeStorageInfo && propertyTable) {
    attributes = convertPropertyTableToAttributeBuffers(featureIds, propertyTable, attributeStorageInfo);
  }
  return {
    nodeId,
    geometry: fileBuffer,
    compressedGeometry,
    texture,
    hasUvRegions: Boolean(uvRegions.length),
    sharedResources: getSharedResources(((_tileContent$gltf2 = tileContent.gltf) === null || _tileContent$gltf2 === void 0 ? void 0 : _tileContent$gltf2.materials) || [], nodeId),
    meshMaterial: material,
    vertexCount,
    attributes,
    featureCount,
    boundingVolumes
  };
}
export async function convertAttributes(attributesData, materialAndTextureList, useCartesianPositions) {
  const {
    nodes,
    images,
    cartographicOrigin,
    cartesianModelMatrix
  } = attributesData;
  const attributesMap = new Map();
  for (const materialAndTexture of materialAndTextureList) {
    const attributes = {
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
    for (const mergedMaterial of materialAndTexture.mergedMaterials) {
      attributesMap.set(mergedMaterial.originalMaterialId, attributes);
    }
  }
  convertNodes(nodes, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions);
  for (const attrKey of attributesMap.keys()) {
    const attributes = attributesMap.get(attrKey);
    if (!attributes) {
      continue;
    }
    if (attributes.positions.length === 0) {
      attributesMap.delete(attrKey);
      continue;
    }
    if (attributes.featureIndicesGroups) {
      attributes.featureIndices = attributes.featureIndicesGroups.reduce((acc, value) => acc.concat(value));
      delete attributes.featureIndicesGroups;
    }
  }
  return attributesMap;
}
function convertNodes(nodes, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions) {
  let matrix = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  if (nodes) {
    for (const node of nodes) {
      convertNode(node, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions, matrix);
    }
  }
}
function getCompositeTransformationMatrix(node, matrix) {
  let transformationMatrix = matrix;
  const {
    matrix: nodeMatrix,
    rotation,
    scale,
    translation
  } = node;
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
  let matrix = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const transformationMatrix = getCompositeTransformationMatrix(node, matrix);
  const mesh = node.mesh;
  if (mesh) {
    convertMesh(mesh, images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions, transformationMatrix);
  }
  convertNodes(node.children || [], images, cartographicOrigin, cartesianModelMatrix, attributesMap, useCartesianPositions, transformationMatrix);
}
function convertMesh(mesh, images, cartographicOrigin, cartesianModelMatrix, attributesMap) {
  let useCartesianPositions = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  let matrix = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  for (const primitive of mesh.primitives) {
    let outputAttributes = null;
    let materialUvRegion;
    if (primitive.material) {
      var _outputAttributes, _outputAttributes$mer;
      outputAttributes = attributesMap.get(primitive.material.id);
      materialUvRegion = (_outputAttributes = outputAttributes) === null || _outputAttributes === void 0 ? void 0 : (_outputAttributes$mer = _outputAttributes.mergedMaterials.find(_ref2 => {
        var _primitive$material;
        let {
          originalMaterialId
        } = _ref2;
        return originalMaterialId === ((_primitive$material = primitive.material) === null || _primitive$material === void 0 ? void 0 : _primitive$material.id);
      })) === null || _outputAttributes$mer === void 0 ? void 0 : _outputAttributes$mer.uvRegion;
    } else if (attributesMap.has('default')) {
      outputAttributes = attributesMap.get('default');
    }
    assert(outputAttributes !== null, 'Primitive - material mapping failed');
    assert(primitive.mode === undefined || primitive.mode === GL.TRIANGLES || primitive.mode === GL.TRIANGLE_STRIP, "Primitive - unsupported mode ".concat(primitive.mode));
    const attributes = primitive.attributes;
    if (!outputAttributes) {
      continue;
    }
    const indices = normalizeIndices(primitive);
    outputAttributes.positions = concatenateTypedArrays(outputAttributes.positions, transformVertexArray({
      vertices: attributes.POSITION.value,
      cartographicOrigin,
      cartesianModelMatrix,
      nodeMatrix: matrix,
      indices,
      attributeSpecificTransformation: transformVertexPositions,
      useCartesianPositions
    }));
    outputAttributes.normals = concatenateTypedArrays(outputAttributes.normals, transformVertexArray({
      vertices: attributes.NORMAL && attributes.NORMAL.value,
      cartographicOrigin,
      cartesianModelMatrix,
      nodeMatrix: matrix,
      indices,
      attributeSpecificTransformation: transformVertexNormals,
      useCartesianPositions: false
    }));
    outputAttributes.texCoords = concatenateTypedArrays(outputAttributes.texCoords, flattenTexCoords(attributes.TEXCOORD_0 && attributes.TEXCOORD_0.value, indices));
    outputAttributes.colors = concatenateTypedArrays(outputAttributes.colors, flattenColors(attributes.COLOR_0, indices));
    if (materialUvRegion) {
      outputAttributes.uvRegions = concatenateTypedArrays(outputAttributes.uvRegions, createUvRegion(materialUvRegion, indices));
    }
    outputAttributes.featureIndicesGroups = outputAttributes.featureIndicesGroups || [];
    outputAttributes.featureIndicesGroups.push(flattenBatchIds(getBatchIds(attributes, primitive, images), indices));
  }
}
function normalizeIndices(primitive) {
  var _primitive$indices;
  let indices = (_primitive$indices = primitive.indices) === null || _primitive$indices === void 0 ? void 0 : _primitive$indices.value;
  if (!indices) {
    const positions = primitive.attributes.POSITION.value;
    return generateSyntheticIndices(positions.length / VALUES_PER_VERTEX);
  }
  if (indices && primitive.mode === GL.TRIANGLE_STRIP) {
    const TypedArrayConstructor = indices.constructor;
    const newIndices = new TypedArrayConstructor((indices.length - 2) * 3);
    let triangleIndex = 0;
    let currentTriangle = indices.slice(0, 3);
    newIndices.set(currentTriangle, 0);
    for (let i = 1; i + 2 < indices.length; i++) {
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
  const {
    vertices,
    indices,
    attributeSpecificTransformation
  } = args;
  const newVertices = new Float32Array(indices.length * VALUES_PER_VERTEX);
  if (!vertices) {
    return newVertices;
  }
  for (let i = 0; i < indices.length; i++) {
    const coordIndex = indices[i] * VALUES_PER_VERTEX;
    const vertex = vertices.subarray(coordIndex, coordIndex + VALUES_PER_VERTEX);
    let vertexVector = new Vector3(Array.from(vertex));
    vertexVector = attributeSpecificTransformation(vertexVector, args);
    newVertices[i * VALUES_PER_VERTEX] = vertexVector.x;
    newVertices[i * VALUES_PER_VERTEX + 1] = vertexVector.y;
    newVertices[i * VALUES_PER_VERTEX + 2] = vertexVector.z;
  }
  return newVertices;
}
function transformVertexPositions(vertexVector, calleeArgs) {
  const {
    cartesianModelMatrix,
    cartographicOrigin,
    nodeMatrix,
    useCartesianPositions
  } = calleeArgs;
  if (nodeMatrix) {
    vertexVector = vertexVector.transform(nodeMatrix);
  }
  vertexVector = vertexVector.transform(cartesianModelMatrix);
  if (useCartesianPositions) {
    return vertexVector;
  }
  Ellipsoid.WGS84.cartesianToCartographic([vertexVector[0], vertexVector[1], vertexVector[2]], vertexVector);
  vertexVector = vertexVector.subtract(cartographicOrigin);
  return vertexVector;
}
function transformVertexNormals(vertexVector, calleeArgs) {
  const {
    cartesianModelMatrix,
    nodeMatrix
  } = calleeArgs;
  if (nodeMatrix) {
    vertexVector = vertexVector.transformAsVector(nodeMatrix);
  }
  vertexVector = vertexVector.transformAsVector(cartesianModelMatrix);
  return vertexVector;
}
function flattenTexCoords(texCoords, indices) {
  const newTexCoords = new Float32Array(indices.length * VALUES_PER_TEX_COORD);
  if (!texCoords) {
    newTexCoords.fill(1);
    return newTexCoords;
  }
  for (let i = 0; i < indices.length; i++) {
    const coordIndex = indices[i] * VALUES_PER_TEX_COORD;
    const texCoord = texCoords.subarray(coordIndex, coordIndex + VALUES_PER_TEX_COORD);
    newTexCoords[i * VALUES_PER_TEX_COORD] = texCoord[0];
    newTexCoords[i * VALUES_PER_TEX_COORD + 1] = texCoord[1];
  }
  return newTexCoords;
}
function flattenColors(colorsAttribute, indices) {
  const components = (colorsAttribute === null || colorsAttribute === void 0 ? void 0 : colorsAttribute.components) || VALUES_PER_COLOR_ELEMENT;
  const newColors = new Uint8Array(indices.length * components);
  if (!colorsAttribute) {
    newColors.fill(255);
    return newColors;
  }
  const colors = colorsAttribute.value;
  for (let i = 0; i < indices.length; i++) {
    const colorIndex = indices[i] * components;
    const color = colors.subarray(colorIndex, colorIndex + components);
    const colorUint8 = new Uint8Array(components);
    for (let j = 0; j < color.length; j++) {
      colorUint8[j] = color[j] * 255;
    }
    newColors.set(colorUint8, i * components);
  }
  return newColors;
}
function createUvRegion(materialUvRegion, indices) {
  const result = new Uint16Array(indices.length * 4);
  for (let i = 0; i < result.length; i += 4) {
    result.set(materialUvRegion, i);
  }
  return result;
}
function flattenBatchIds(batchedIds, indices) {
  if (!batchedIds.length || !indices.length) {
    return [];
  }
  const newBatchIds = [];
  for (let i = 0; i < indices.length; i++) {
    const coordIndex = indices[i];
    newBatchIds.push(batchedIds[coordIndex]);
  }
  return newBatchIds;
}
function getBatchIds(attributes, primitive, images) {
  const batchIds = handleBatchIdsExtensions(attributes, primitive, images);
  if (batchIds.length) {
    return batchIds;
  }
  for (let index = 0; index < BATCHED_ID_POSSIBLE_ATTRIBUTE_NAMES.length; index++) {
    const possibleBatchIdAttributeName = BATCHED_ID_POSSIBLE_ATTRIBUTE_NAMES[index];
    if (attributes[possibleBatchIdAttributeName] && attributes[possibleBatchIdAttributeName].value) {
      return attributes[possibleBatchIdAttributeName].value;
    }
  }
  return [];
}
async function convertMaterials() {
  let sourceMaterials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let shouldMergeMaterials = arguments.length > 1 ? arguments[1] : undefined;
  let materials = [];
  for (const sourceMaterial of sourceMaterials) {
    materials.push(convertMaterial(sourceMaterial));
  }
  if (shouldMergeMaterials) {
    materials = await mergeAllMaterials(materials);
  }
  return materials;
}
async function mergeAllMaterials(materials) {
  const result = [];
  while (materials.length > 0) {
    let newMaterial = materials.splice(0, 1)[0];
    const mergedIndices = [];
    for (let i = 0; i < materials.length; i++) {
      const material = materials[i];
      if (newMaterial.texture && material.texture || !newMaterial.texture && !material.texture) {
        newMaterial = await mergeMaterials(newMaterial, material);
        mergedIndices.push(i);
      }
    }
    if (newMaterial.texture && mergedIndices.length) {
      var _newMaterial$mergedMa, _newMaterial$mergedMa2;
      const newWidth = (_newMaterial$mergedMa = newMaterial.mergedMaterials) === null || _newMaterial$mergedMa === void 0 ? void 0 : _newMaterial$mergedMa.reduce((accum, _ref3) => {
        let {
          textureSize
        } = _ref3;
        return accum + ((textureSize === null || textureSize === void 0 ? void 0 : textureSize.width) || 0);
      }, 0);
      const newHeight = (_newMaterial$mergedMa2 = newMaterial.mergedMaterials) === null || _newMaterial$mergedMa2 === void 0 ? void 0 : _newMaterial$mergedMa2.reduce((accum, _ref4) => {
        let {
          textureSize
        } = _ref4;
        return Math.max(accum, (textureSize === null || textureSize === void 0 ? void 0 : textureSize.height) || 0);
      }, 0);
      let currentX = -1;
      for (const aTextureMetadata of newMaterial.mergedMaterials) {
        if (aTextureMetadata.textureSize) {
          const newX = currentX + 1 + aTextureMetadata.textureSize.width / newWidth * 2 ** (Uint16Array.BYTES_PER_ELEMENT * 8) - 1;
          aTextureMetadata.uvRegion = new Uint16Array([currentX + 1, 0, newX, aTextureMetadata.textureSize.height / newHeight * 2 ** (Uint16Array.BYTES_PER_ELEMENT * 8) - 1]);
          currentX = newX;
        }
      }
      newMaterial.texture.image.width = newWidth;
      newMaterial.texture.image.height = newHeight;
    }
    for (const index of mergedIndices.reverse()) {
      materials.splice(index, 1);
    }
    result.push(newMaterial);
  }
  if (!result.length) {
    result.push({
      material: getDefaultMaterial(),
      mergedMaterials: [{
        originalMaterialId: 'default'
      }]
    });
  }
  return result;
}
async function mergeMaterials(material1, material2) {
  var _material1$texture, _material2$texture;
  if ((_material1$texture = material1.texture) !== null && _material1$texture !== void 0 && _material1$texture.bufferView && (_material2$texture = material2.texture) !== null && _material2$texture !== void 0 && _material2$texture.bufferView && material1.mergedMaterials && material2.mergedMaterials) {
    const buffer1 = Buffer.from(material1.texture.bufferView.data);
    const buffer2 = Buffer.from(material2.texture.bufferView.data);
    try {
      const {
        joinImages
      } = await import('join-images');
      const sharpData = await joinImages([buffer1, buffer2], {
        direction: 'horizontal'
      });
      material1.texture.bufferView.data = await sharpData.toFormat(material1.texture.mimeType === 'image/png' ? 'png' : 'jpeg').toBuffer();
    } catch (error) {
      console.log('Join images into a texture atlas has failed. Consider usage `--split-nodes` option. (See documentation https://loaders.gl/modules/tile-converter/docs/cli-reference/tile-converter)');
      throw error;
    }
    material1.material.pbrMetallicRoughness.baseColorTexture.textureSetDefinitionId = 1;
  }
  material1.mergedMaterials = material1.mergedMaterials.concat(material2.mergedMaterials);
  return material1;
}
function convertMaterial(sourceMaterial) {
  var _sourceMaterial$emiss, _sourceMaterial$pbrMe, _sourceMaterial$pbrMe2, _sourceMaterial$pbrMe3;
  const material = {
    doubleSided: sourceMaterial.doubleSided,
    emissiveFactor: (_sourceMaterial$emiss = sourceMaterial.emissiveFactor) === null || _sourceMaterial$emiss === void 0 ? void 0 : _sourceMaterial$emiss.map(c => Math.round(c * 255)),
    alphaMode: convertAlphaMode(sourceMaterial.alphaMode),
    pbrMetallicRoughness: {
      roughnessFactor: (sourceMaterial === null || sourceMaterial === void 0 ? void 0 : (_sourceMaterial$pbrMe = sourceMaterial.pbrMetallicRoughness) === null || _sourceMaterial$pbrMe === void 0 ? void 0 : _sourceMaterial$pbrMe.roughnessFactor) || DEFAULT_ROUGHNESS_FACTOR,
      metallicFactor: (sourceMaterial === null || sourceMaterial === void 0 ? void 0 : (_sourceMaterial$pbrMe2 = sourceMaterial.pbrMetallicRoughness) === null || _sourceMaterial$pbrMe2 === void 0 ? void 0 : _sourceMaterial$pbrMe2.metallicFactor) || DEFAULT_METALLIC_FACTOR
    }
  };
  let texture;
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
  sourceMaterial.id = Number.isFinite(sourceMaterial.id) ? sourceMaterial.id : uuidv4();
  let mergedMaterials = [{
    originalMaterialId: sourceMaterial.id
  }];
  if (!texture) {
    var _sourceMaterial$pbrMe4;
    const baseColorFactor = sourceMaterial === null || sourceMaterial === void 0 ? void 0 : (_sourceMaterial$pbrMe4 = sourceMaterial.pbrMetallicRoughness) === null || _sourceMaterial$pbrMe4 === void 0 ? void 0 : _sourceMaterial$pbrMe4.baseColorFactor;
    material.pbrMetallicRoughness.baseColorFactor = baseColorFactor && baseColorFactor.map(c => Math.round(c * 255)) || undefined;
  } else {
    mergedMaterials[0].textureSize = {
      width: texture.image.width,
      height: texture.image.height
    };
  }
  return {
    material,
    texture,
    mergedMaterials
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
  const i3sResources = {};
  if (!gltfMaterials || !gltfMaterials.length) {
    return i3sResources;
  }
  i3sResources.materialDefinitionInfos = [];
  for (const gltfMaterial of gltfMaterials) {
    const {
      materialDefinitionInfo,
      textureDefinitionInfo
    } = convertGLTFMaterialToI3sSharedResources(gltfMaterial, nodeId);
    i3sResources.materialDefinitionInfos.push(materialDefinitionInfo);
    if (textureDefinitionInfo) {
      i3sResources.textureDefinitionInfos = i3sResources.textureDefinitionInfos || [];
      i3sResources.textureDefinitionInfos.push(textureDefinitionInfo);
    }
  }
  return i3sResources;
}
function convertGLTFMaterialToI3sSharedResources(gltfMaterial, nodeId) {
  var _gltfMaterial$pbrMeta;
  const texture = (gltfMaterial === null || gltfMaterial === void 0 ? void 0 : (_gltfMaterial$pbrMeta = gltfMaterial.pbrMetallicRoughness) === null || _gltfMaterial$pbrMeta === void 0 ? void 0 : _gltfMaterial$pbrMeta.baseColorTexture) || gltfMaterial.emissiveTexture;
  let textureDefinitionInfo = null;
  if (texture) {
    textureDefinitionInfo = extractSharedResourcesTextureInfo(texture.texture, nodeId);
  }
  const {
    baseColorFactor,
    metallicFactor
  } = (gltfMaterial === null || gltfMaterial === void 0 ? void 0 : gltfMaterial.pbrMetallicRoughness) || {};
  let colorFactor = baseColorFactor;
  if ((!baseColorFactor || baseColorFactor[3] === 0) && gltfMaterial.emissiveFactor) {
    colorFactor = gltfMaterial.emissiveFactor;
    colorFactor[3] = colorFactor[3] || 1;
  }
  return {
    materialDefinitionInfo: extractSharedResourcesMaterialInfo(colorFactor || [1, 1, 1, 1], metallicFactor),
    textureDefinitionInfo
  };
}
function extractSharedResourcesMaterialInfo(baseColorFactor) {
  let metallicFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  const matDielectricColorComponent = 0.04 / 255;
  const black = new Vector4(0, 0, 0, 1);
  const unitVector = new Vector4(1, 1, 1, 1);
  const dielectricSpecular = new Vector4(matDielectricColorComponent, matDielectricColorComponent, matDielectricColorComponent, 0);
  const baseColorVector = new Vector4(baseColorFactor);
  const firstOperand = unitVector.subtract(dielectricSpecular).multiply(baseColorVector);
  const diffuse = firstOperand.lerp(firstOperand, black, metallicFactor);
  dielectricSpecular[3] = 1;
  const specular = dielectricSpecular.lerp(dielectricSpecular, baseColorVector, metallicFactor);
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
  const {
    width,
    height
  } = ((_texture$source5 = texture.source) === null || _texture$source5 === void 0 ? void 0 : _texture$source5.image) || {};
  if (!width || !height) {
    return '';
  }
  const levelCountOfTexture = 1;
  const indexOfLevel = 0;
  const indexOfTextureInStore = nodeId + 1;
  const zerosCount = 32 - indexOfTextureInStore.toString(2).length;
  const rightHalf = '0'.repeat(zerosCount).concat(indexOfTextureInStore.toString(2));
  const shiftedLevelCountOfTexture = levelCountOfTexture << 28;
  const shiftedIndexOfLevel = indexOfLevel << 24;
  const shiftedWidth = width - 1 << 12;
  const shiftedHeight = height - 1 << 0;
  const leftHalf = shiftedLevelCountOfTexture + shiftedIndexOfLevel + shiftedWidth + shiftedHeight;
  const imageId = BigInt("0b".concat(leftHalf.toString(2)).concat(rightHalf));
  return imageId.toString();
}
function makeFeatureIdsUnique(featureIds, featureIndices, featuresHashArray, batchTable) {
  const replaceMap = getFeaturesReplaceMap(featureIds, batchTable, featuresHashArray);
  replaceIndicesByUnique(featureIndices, replaceMap);
  replaceIndicesByUnique(featureIds, replaceMap);
}
function getFeaturesReplaceMap(featureIds, batchTable, featuresHashArray) {
  const featureMap = {};
  for (let index = 0; index < featureIds.length; index++) {
    const oldFeatureId = featureIds[index];
    const uniqueFeatureId = getOrCreateUniqueFeatureId(index, batchTable, featuresHashArray);
    featureMap[oldFeatureId.toString()] = uniqueFeatureId;
  }
  return featureMap;
}
function generateStringFromBatchTableByIndex(batchTable, index) {
  let str = '';
  for (const key in batchTable) {
    str += batchTable[key][index];
  }
  return str;
}
function getOrCreateUniqueFeatureId(index, batchTable, featuresHashArray) {
  const batchTableStr = generateStringFromBatchTableByIndex(batchTable, index);
  const hash = md5(batchTableStr);
  if (featuresHashArray.includes(hash)) {
    return featuresHashArray.indexOf(hash);
  }
  return featuresHashArray.push(hash) - 1;
}
function replaceIndicesByUnique(indicesArray, featureMap) {
  for (let index = 0; index < indicesArray.length; index++) {
    indicesArray[index] = featureMap[indicesArray[index]];
  }
}
function convertPropertyTableToAttributeBuffers(featureIds, propertyTable, attributeStorageInfo) {
  const attributeBuffers = [];
  const needFlattenPropertyTable = checkPropertiesLength(featureIds, propertyTable);
  const properties = needFlattenPropertyTable ? flattenPropertyTableByFeatureIds(featureIds, propertyTable) : propertyTable;
  const propertyTableWithObjectIds = {
    OBJECTID: featureIds,
    ...properties
  };
  for (const propertyName in propertyTableWithObjectIds) {
    const type = getAttributeType(propertyName, attributeStorageInfo);
    const value = propertyTableWithObjectIds[propertyName];
    const attributeBuffer = generateAttributeBuffer(type, value);
    attributeBuffers.push(attributeBuffer);
  }
  return attributeBuffers;
}
function generateAttributeBuffer(type, value) {
  let attributeBuffer;
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
  const attribute = attributeStorageInfo.find(attr => attr.name === key);
  return attribute.attributeValues.valueType;
}
function generateShortIntegerAttributeBuffer(featureIds) {
  const count = new Uint32Array([featureIds.length]);
  const valuesArray = new Uint32Array(featureIds);
  return concatenateArrayBuffers(count.buffer, valuesArray.buffer);
}
function generateDoubleAttributeBuffer(featureIds) {
  const count = new Uint32Array([featureIds.length]);
  const padding = new Uint8Array(4);
  const valuesArray = new Float64Array(featureIds);
  return concatenateArrayBuffers(count.buffer, padding.buffer, valuesArray.buffer);
}
function generateStringAttributeBuffer(batchAttributes) {
  const stringCountArray = new Uint32Array([batchAttributes.length]);
  let totalNumberOfBytes = 0;
  const stringSizesArray = new Uint32Array(batchAttributes.length);
  const stringBufferArray = [];
  for (let index = 0; index < batchAttributes.length; index++) {
    const currentString = "".concat(String(batchAttributes[index]), "\0");
    const currentStringBuffer = Buffer.from(currentString);
    const currentStringSize = currentStringBuffer.length;
    totalNumberOfBytes += currentStringSize;
    stringSizesArray[index] = currentStringSize;
    stringBufferArray.push(currentStringBuffer);
  }
  const totalBytes = new Uint32Array([totalNumberOfBytes]);
  return concatenateArrayBuffers(stringCountArray.buffer, totalBytes.buffer, stringSizesArray.buffer, ...stringBufferArray);
}
function generateBigUint64Array(featureIds) {
  const typedFeatureIds = new BigUint64Array(featureIds.length);
  for (let index = 0; index < featureIds.length; index++) {
    typedFeatureIds[index] = BigInt(featureIds[index]);
  }
  return typedFeatureIds;
}
async function generateCompressedGeometry(vertexCount, convertedAttributes, attributes, dracoWorkerSoure) {
  const {
    positions,
    normals,
    texCoords,
    colors,
    uvRegions,
    featureIds,
    faceRange
  } = attributes;
  const indices = new Uint32Array(vertexCount);
  for (let index = 0; index < indices.length; index++) {
    indices.set([index], index);
  }
  const featureIndices = new Uint32Array(convertedAttributes.featureIndices.length ? convertedAttributes.featureIndices : vertexCount);
  const featureIndex = generateFeatureIndexAttribute(featureIndices, faceRange);
  const compressedAttributes = {
    positions,
    normals,
    colors,
    'feature-index': featureIndex
  };
  if (texCoords.length) {
    compressedAttributes.texCoords = texCoords;
  }
  const attributesMetadata = {
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
  return encode({
    attributes: compressedAttributes,
    indices
  }, DracoWriterWorker, {
    ...DracoWriterWorker.options,
    source: dracoWorkerSoure,
    reuseWorkers: true,
    _nodeWorkers: true,
    draco: {
      method: 'MESH_SEQUENTIAL_ENCODING',
      attributesMetadata
    }
  });
}
function generateFeatureIndexAttribute(featureIndex, faceRange) {
  const orderedFeatureIndices = new Uint32Array(featureIndex.length);
  let fillIndex = 0;
  let startIndex = 0;
  for (let index = 1; index < faceRange.length; index += 2) {
    const endIndex = (faceRange[index] + 1) * VALUES_PER_VERTEX;
    orderedFeatureIndices.fill(fillIndex, startIndex, endIndex);
    fillIndex++;
    startIndex = endIndex + 1;
  }
  return orderedFeatureIndices;
}
export function getPropertyTable(tileContent) {
  const batchTableJson = tileContent === null || tileContent === void 0 ? void 0 : tileContent.batchTableJson;
  if (batchTableJson) {
    return batchTableJson;
  }
  const {
    extensionName,
    extension
  } = getPropertyTableExtension(tileContent);
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
  var _tileContent$gltf3, _tileContent$gltf5, _tileContent$gltf5$ex;
  const extensionsWithPropertyTables = [EXT_FEATURE_METADATA, EXT_MESH_FEATURES];
  const extensionsUsed = tileContent === null || tileContent === void 0 ? void 0 : (_tileContent$gltf3 = tileContent.gltf) === null || _tileContent$gltf3 === void 0 ? void 0 : _tileContent$gltf3.extensionsUsed;
  if (!extensionsUsed) {
    return {
      extensionName: null,
      extension: null
    };
  }
  let extensionName = '';
  for (const extensionItem of (tileContent === null || tileContent === void 0 ? void 0 : (_tileContent$gltf4 = tileContent.gltf) === null || _tileContent$gltf4 === void 0 ? void 0 : _tileContent$gltf4.extensionsUsed) || []) {
    var _tileContent$gltf4;
    if (extensionsWithPropertyTables.includes(extensionItem)) {
      extensionName = extensionItem;
      break;
    }
  }
  const extension = tileContent === null || tileContent === void 0 ? void 0 : (_tileContent$gltf5 = tileContent.gltf) === null || _tileContent$gltf5 === void 0 ? void 0 : (_tileContent$gltf5$ex = _tileContent$gltf5.extensions) === null || _tileContent$gltf5$ex === void 0 ? void 0 : _tileContent$gltf5$ex[extensionName];
  return {
    extensionName,
    extension
  };
}
function getPropertyTableFromExtFeatureMetadata(extension) {
  if (extension !== null && extension !== void 0 && extension.featureTextures) {
    console.warn('The I3S converter does not yet support the EXT_feature_metadata feature textures');
    return null;
  }
  if (extension !== null && extension !== void 0 && extension.featureTables) {
    var _Object$keys;
    const firstFeatureTableName = (_Object$keys = Object.keys(extension.featureTables)) === null || _Object$keys === void 0 ? void 0 : _Object$keys[0];
    if (firstFeatureTableName) {
      const featureTable = extension === null || extension === void 0 ? void 0 : extension.featureTables[firstFeatureTableName];
      const propertyTable = {};
      for (const propertyName in featureTable.properties) {
        propertyTable[propertyName] = featureTable.properties[propertyName].data;
      }
      return propertyTable;
    }
  }
  console.warn("The I3S converter couldn't handle EXT_feature_metadata extension");
  return null;
}
//# sourceMappingURL=geometry-converter.js.map