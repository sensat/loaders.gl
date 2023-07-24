import { Tiles3DTileContent } from '@loaders.gl/3d-tiles';
import { GltfPrimitiveModeString, PreprocessData } from '../types';
/**
 * glTF primitive modes
 * @see https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#_mesh_primitive_mode
 */
export declare const GLTF_PRIMITIVE_MODES: GltfPrimitiveModeString[];
/**
 * Analyze tile content. This function is used during preprocess stage of
 * conversion
 * @param tileContent - 3DTiles tile content ArrayBuffer
 * @returns
 */
export declare const analyzeTileContent: (tileContent: Tiles3DTileContent | null) => Promise<PreprocessData>;
/**
 * Merge object2 into object1
 * @param object1
 * @param object2
 * @returns nothing
 */
export declare const mergePreprocessData: (object1: PreprocessData, object2: PreprocessData) => void;
//# sourceMappingURL=preprocess-3d-tiles.d.ts.map