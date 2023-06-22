import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { encodeSync } from '@loaders.gl/core';
import { GLTFScenegraph, GLTFWriter } from '@loaders.gl/gltf';
import { Tile3DWriter } from '@loaders.gl/3d-tiles';
import { Matrix4, Vector3 } from '@math.gl/core';
import { Ellipsoid } from '@math.gl/geospatial';
import { convertTextureAtlas } from './texture-atlas';
import { generateSyntheticIndices } from '../../lib/utils/geometry-utils';
const Z_UP_TO_Y_UP_MATRIX = new Matrix4([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
const scratchVector = new Vector3();
export default class B3dmConverter {
  constructor() {
    _defineProperty(this, "rtcCenter", void 0);
    _defineProperty(this, "i3sTile", void 0);
  }
  async convert(i3sAttributesData) {
    let featureAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const gltf = await this.buildGltf(i3sAttributesData, featureAttributes);
    const b3dm = encodeSync({
      gltfEncoded: new Uint8Array(gltf),
      type: 'b3dm',
      featuresLength: this._getFeaturesLength(featureAttributes),
      batchTable: featureAttributes
    }, Tile3DWriter);
    return b3dm;
  }
  async buildGltf(i3sAttributesData, featureAttributes) {
    const {
      tileContent,
      textureFormat
    } = i3sAttributesData;
    const {
      material,
      attributes,
      indices: originalIndices,
      cartesianOrigin,
      cartographicOrigin,
      modelMatrix
    } = tileContent;
    const gltfBuilder = new GLTFScenegraph();
    const textureIndex = await this._addI3sTextureToGltf(tileContent, textureFormat, gltfBuilder);
    const pbrMaterialInfo = this._convertI3sMaterialToGltfMaterial(material, textureIndex);
    const materialIndex = gltfBuilder.addMaterial(pbrMaterialInfo);
    const positions = attributes.positions;
    const positionsValue = positions.value;
    if (attributes.uvRegions && attributes.texCoords) {
      attributes.texCoords.value = convertTextureAtlas(attributes.texCoords.value, attributes.uvRegions.value);
    }
    attributes.positions.value = this._normalizePositions(positionsValue, cartesianOrigin, cartographicOrigin, modelMatrix);
    this._createBatchIds(tileContent, featureAttributes);
    if (attributes.normals && !this._checkNormals(attributes.normals.value)) {
      delete attributes.normals;
    }
    const indices = originalIndices || generateSyntheticIndices(positionsValue.length / positions.size);
    const meshIndex = gltfBuilder.addMesh({
      attributes,
      indices,
      material: materialIndex,
      mode: 4
    });
    const transformMatrix = this._generateTransformMatrix(cartesianOrigin);
    const nodeIndex = gltfBuilder.addNode({
      meshIndex,
      matrix: transformMatrix
    });
    const sceneIndex = gltfBuilder.addScene({
      nodeIndices: [nodeIndex]
    });
    gltfBuilder.setDefaultScene(sceneIndex);
    gltfBuilder.createBinaryChunk();
    const gltfBuffer = encodeSync(gltfBuilder.gltf, GLTFWriter);
    return gltfBuffer;
  }
  async _addI3sTextureToGltf(tileContent, textureFormat, gltfBuilder) {
    const {
      texture,
      material,
      attributes
    } = tileContent;
    let textureIndex = null;
    let selectedTexture = texture;
    if (!texture && material) {
      selectedTexture = material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture && material.pbrMetallicRoughness.baseColorTexture.texture.source.image;
    }
    if (selectedTexture) {
      const mimeType = this._deduceMimeTypeFromFormat(textureFormat);
      const imageIndex = gltfBuilder.addImage(selectedTexture, mimeType);
      textureIndex = gltfBuilder.addTexture({
        imageIndex
      });
      delete attributes.colors;
    }
    return textureIndex;
  }
  _normalizePositions(positionsValue, cartesianOrigin, cartographicOrigin, modelMatrix) {
    const newPositionsValue = new Float32Array(positionsValue.length);
    for (let index = 0; index < positionsValue.length; index += 3) {
      const vertex = positionsValue.subarray(index, index + 3);
      const cartesianOriginVector = new Vector3(cartesianOrigin);
      let vertexVector = new Vector3(Array.from(vertex)).transform(modelMatrix).add(cartographicOrigin);
      Ellipsoid.WGS84.cartographicToCartesian(vertexVector, scratchVector);
      vertexVector = scratchVector.subtract(cartesianOriginVector);
      newPositionsValue.set(vertexVector, index);
    }
    return newPositionsValue;
  }
  _generateTransformMatrix(cartesianOrigin) {
    const translateOriginMatrix = new Matrix4().translate(cartesianOrigin);
    const result = translateOriginMatrix.multiplyLeft(Z_UP_TO_Y_UP_MATRIX);
    return result;
  }
  _createBatchIds(i3sContent, featureAttributes) {
    const {
      featureIds
    } = i3sContent;
    const {
      OBJECTID: objectIds
    } = featureAttributes || {};
    if (!featureIds || !objectIds) {
      return;
    }
    for (let i = 0; i < featureIds.length; i++) {
      const featureId = featureIds[i];
      const batchId = objectIds.indexOf(featureId);
      featureIds[i] = batchId;
    }
    i3sContent.attributes._BATCHID = {
      size: 1,
      byteOffset: 0,
      value: featureIds
    };
  }
  _deduceMimeTypeFromFormat(format) {
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
  _convertI3sMaterialToGltfMaterial(material, textureIndex) {
    const isTextureIndexExists = textureIndex !== null;
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
  _setGltfTexture(materialDefinition, textureIndex) {
    const material = {
      ...materialDefinition,
      pbrMetallicRoughness: {
        ...materialDefinition.pbrMetallicRoughness
      }
    };
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
  _getFeaturesLength(attributes) {
    if (!attributes) {
      return 0;
    }
    const firstKey = Object.keys(attributes)[0];
    return firstKey ? attributes[firstKey].length : 0;
  }
  _checkNormals(normals) {
    return normals.find(value => value);
  }
}
//# sourceMappingURL=b3dm-converter.js.map