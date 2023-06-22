import type { I3SAttributesData } from '../../3d-tiles-attributes-worker';
import { Matrix4 } from '@math.gl/core';
/**
 * Converts content of an I3S node to *.b3dm's file content
 */
export default class B3dmConverter {
    rtcCenter: Float32Array;
    i3sTile: any;
    /**
     * The starter of content conversion
     * @param i3sTile - Tile3D instance for I3S node
     * @returns - encoded content
     */
    convert(i3sAttributesData: I3SAttributesData, featureAttributes?: any): Promise<ArrayBuffer>;
    /**
     * Build and encode gltf
     * @param i3sTile - Tile3D instance for I3S node
     * @returns - encoded glb content
     */
    buildGltf(i3sAttributesData: I3SAttributesData, featureAttributes: any): Promise<ArrayBuffer>;
    /**
     * Update gltfBuilder with texture from I3S tile
     * @param {object} i3sTile - Tile3D object
     * @param {GLTFScenegraph} gltfBuilder - gltfScenegraph instance to construct GLTF
     * @returns {Promise<number | null>} - GLTF texture index
     */
    _addI3sTextureToGltf(tileContent: any, textureFormat: any, gltfBuilder: any): Promise<null>;
    /**
     * Generate a positions array which is correct for 3DTiles/GLTF format
     * @param {Float64Array} positionsValue - the input geometry positions array
     * @param {number[]} cartesianOrigin - the tile center in the cartesian coordinate system
     * @param {number[]} cartographicOrigin - the tile center in the cartographic coordinate system
     * @param {number[]} modelMatrix - the model matrix of geometry
     * @returns {Float32Array} - the output geometry positions array
     */
    _normalizePositions(positionsValue: any, cartesianOrigin: any, cartographicOrigin: any, modelMatrix: any): Float32Array;
    /**
     * Generate the transformation matrix for GLTF node:
     * https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#reference-node
     * 1. Create the translate transformation from cartesianOrigin (the positions array stores offsets from this cartesianOrigin)
     * 2. Create the rotation transformation to rotate model from z-up coordinates (I3S specific) to y-up coordinates (GLTF specific)
     * @param {number[]} cartesianOrigin - the tile center in the cartesian coordinate system
     * @returns {Matrix4} - an array of 16 numbers (4x4 matrix)
     */
    _generateTransformMatrix(cartesianOrigin: any): Matrix4;
    /**
     * Create _BATCHID attribute
     * @param {Object} i3sContent - the source object
     * @returns {void}
     */
    _createBatchIds(i3sContent: any, featureAttributes: any): void;
    /**
     * Deduce mime type by format from `textureSetDefinition.formats[0].format`
     * https://github.com/Esri/i3s-spec/blob/master/docs/1.7/textureSetDefinitionFormat.cmn.md
     * @param {string} format - format name
     * @returns {string} mime type.
     */
    _deduceMimeTypeFromFormat(format: any): "image/jpeg" | "image/png" | "image/ktx2";
    /**
     * Convert i3s material to GLTF compatible material
     * @param {object} material - i3s material definition
     * @param {number | null} textureIndex - texture index in GLTF
     * @returns {object} GLTF material
     */
    _convertI3sMaterialToGltfMaterial(material: any, textureIndex: any): any;
    /**
     * Set texture properties in material with GLTF textureIndex
     * @param {object} materialDefinition - i3s material definition
     * @param {number} textureIndex - texture index in GLTF
     * @returns {void}
     */
    _setGltfTexture(materialDefinition: any, textureIndex: any): any;
    _getFeaturesLength(attributes: any): any;
    _checkNormals(normals: any): any;
}
//# sourceMappingURL=b3dm-converter.d.ts.map