"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergePreprocessData = exports.analyzeTileContent = exports.GLTF_PRIMITIVE_MODES = void 0;
const types_1 = require("../types");
const gltf_1 = require("@loaders.gl/gltf");
const core_1 = require("@loaders.gl/core");
/**
 * glTF primitive modes
 * @see https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#_mesh_primitive_mode
 */
exports.GLTF_PRIMITIVE_MODES = [
    types_1.GltfPrimitiveModeString.POINTS,
    types_1.GltfPrimitiveModeString.LINES,
    types_1.GltfPrimitiveModeString.LINE_LOOP,
    types_1.GltfPrimitiveModeString.LINE_STRIP,
    types_1.GltfPrimitiveModeString.TRIANGLES,
    types_1.GltfPrimitiveModeString.TRIANGLE_STRIP,
    types_1.GltfPrimitiveModeString.TRIANGLE_FAN // 6
];
/**
 * Analyze tile content. This function is used during preprocess stage of
 * conversion
 * @param tileContent - 3DTiles tile content ArrayBuffer
 * @returns
 */
const analyzeTileContent = async (tileContent) => {
    const result = {
        meshTopologyTypes: new Set()
    };
    if (!tileContent?.gltfArrayBuffer) {
        return result;
    }
    const gltfData = await (0, core_1.parse)(tileContent.gltfArrayBuffer, gltf_1.GLTFLoader, {
        gltf: { normalize: false, loadBuffers: false, loadImages: false, decompressMeshes: false }
    });
    const gltf = gltfData.json;
    if (!gltf) {
        return result;
    }
    const meshTypes = getMeshTypesFromGltf(gltf);
    result.meshTopologyTypes = meshTypes;
    return result;
};
exports.analyzeTileContent = analyzeTileContent;
/**
 * Get mesh topology types that the glb content has
 * @param gltfJson - JSON part of GLB content
 * @returns array of mesh types found
 */
const getMeshTypesFromGltf = (gltfJson) => {
    const result = new Set();
    for (const mesh of gltfJson.meshes || []) {
        for (const primitive of mesh.primitives) {
            let { mode } = primitive;
            if (typeof mode !== 'number') {
                mode = 4; // Default is 4 - TRIANGLES
            }
            result.add(exports.GLTF_PRIMITIVE_MODES[mode]);
        }
    }
    return result;
};
/**
 * Merge object2 into object1
 * @param object1
 * @param object2
 * @returns nothing
 */
const mergePreprocessData = (object1, object2) => {
    // Merge topology mesh types info
    for (const type of object2.meshTopologyTypes) {
        object1.meshTopologyTypes.add(type);
    }
};
exports.mergePreprocessData = mergePreprocessData;
