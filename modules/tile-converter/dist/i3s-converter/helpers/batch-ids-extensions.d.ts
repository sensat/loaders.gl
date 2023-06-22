import { GLTFAccessorPostprocessed, GLTFMeshPrimitivePostprocessed } from '@loaders.gl/gltf';
import type { NumericArray } from '@loaders.gl/loader-utils';
import { TextureImageProperties } from '../../i3s-attributes-worker';
/**
 * Getting batchIds from 3DTilesNext extensions.
 * @param attributes - gltf accessors
 * @param primitive - gltf primitive data
 * @param images - gltf texture images
 */
export declare function handleBatchIdsExtensions(attributes: {
    [key: string]: GLTFAccessorPostprocessed;
}, primitive: GLTFMeshPrimitivePostprocessed, images: (TextureImageProperties | null)[]): NumericArray;
//# sourceMappingURL=batch-ids-extensions.d.ts.map