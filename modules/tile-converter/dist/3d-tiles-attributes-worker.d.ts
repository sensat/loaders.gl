import type { WorkerObject } from '@loaders.gl/worker-utils';
import type { FeatureAttribute } from '@loaders.gl/i3s';
export type Tile3DAttributesWorkerOptions = {
    featureAttributes: FeatureAttribute | null;
    source: string;
};
export type I3SAttributesData = {
    tileContent: any;
    textureFormat: string;
};
/**
 * I3S Attributes Worker to handle B3DM object
 */
export declare const Tile3dAttributesWorker: {
    id: string;
    name: string;
    module: string;
    version: any;
    options: {
        featureAttributes: null;
    };
};
/**
 * Performs I3S attributes transformation
 */
export declare function transform3DTilesAttributesOnWorker(i3sAttributesData: I3SAttributesData, options: Tile3DAttributesWorkerOptions): Promise<ArrayBuffer>;
export declare const _typecheckI3SAttributesWorker: WorkerObject;
//# sourceMappingURL=3d-tiles-attributes-worker.d.ts.map