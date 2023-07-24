import { GltfPrimitiveModeString } from '../types';
import { GLTFLoader } from '@loaders.gl/gltf';
import { parse } from '@loaders.gl/core';
export const GLTF_PRIMITIVE_MODES = [GltfPrimitiveModeString.POINTS, GltfPrimitiveModeString.LINES, GltfPrimitiveModeString.LINE_LOOP, GltfPrimitiveModeString.LINE_STRIP, GltfPrimitiveModeString.TRIANGLES, GltfPrimitiveModeString.TRIANGLE_STRIP, GltfPrimitiveModeString.TRIANGLE_FAN];
export const analyzeTileContent = async tileContent => {
  const result = {
    meshTopologyTypes: new Set()
  };
  if (!(tileContent !== null && tileContent !== void 0 && tileContent.gltfArrayBuffer)) {
    return result;
  }
  const gltfData = await parse(tileContent.gltfArrayBuffer, GLTFLoader, {
    gltf: {
      normalize: false,
      loadBuffers: false,
      loadImages: false,
      decompressMeshes: false
    }
  });
  const gltf = gltfData.json;
  if (!gltf) {
    return result;
  }
  const meshTypes = getMeshTypesFromGltf(gltf);
  result.meshTopologyTypes = meshTypes;
  return result;
};
const getMeshTypesFromGltf = gltfJson => {
  const result = new Set();
  for (const mesh of gltfJson.meshes || []) {
    for (const primitive of mesh.primitives) {
      let {
        mode
      } = primitive;
      if (typeof mode !== 'number') {
        mode = 4;
      }
      result.add(GLTF_PRIMITIVE_MODES[mode]);
    }
  }
  return result;
};
export const mergePreprocessData = (object1, object2) => {
  for (const type of object2.meshTopologyTypes) {
    object1.meshTopologyTypes.add(type);
  }
};
//# sourceMappingURL=preprocess-3d-tiles.js.map