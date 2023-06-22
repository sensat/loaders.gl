import type { WorkerObject } from '@loaders.gl/worker-utils';
import type { ConvertedAttributes } from './i3s-converter/types';
import type { Matrix4, Vector3 } from '@math.gl/core';
import type { GLTFNodePostprocessed } from '@loaders.gl/gltf';
export type I3SAttributesWorkerOptions = {
    _nodeWorkers: boolean;
    reuseWorkers: boolean;
    useCartesianPositions: boolean;
    source: string;
};
export type TextureImageProperties = {
    data: Uint8Array;
    compressed?: boolean;
    height?: number;
    width?: number;
    components?: number;
    mimeType?: string;
};
export type B3DMAttributesData = {
    gltfMaterials?: {
        id: string;
    }[];
    nodes: GLTFNodePostprocessed[];
    images: (null | TextureImageProperties)[];
    cartographicOrigin: Vector3;
    cartesianModelMatrix: Matrix4;
};
/**
 * I3S Attributes Worker to handle B3DM object
 */
export declare const I3SAttributesWorker: {
    id: string;
    name: string;
    module: string;
    version: any;
    options: {
        useCartesianPositions: boolean;
    };
};
/**
 * Performs I3S attributes transformation
 */
export declare function transformI3SAttributesOnWorker(attributesData: B3DMAttributesData, options: I3SAttributesWorkerOptions): Promise<Map<string, ConvertedAttributes>>;
export declare const _typecheckI3SAttributesWorker: WorkerObject;
//# sourceMappingURL=i3s-attributes-worker.d.ts.map