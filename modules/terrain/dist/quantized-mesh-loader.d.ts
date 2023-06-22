import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
export type QuantizedMeshLoaderOptions = LoaderOptions & {
    'quantized-mesh'?: {
        bounds?: [number, number, number, number];
        skirtHeight?: number | null;
    };
};
/**
 * Worker loader for quantized meshes
 */
export declare const QuantizedMeshLoader: Loader<any, never, QuantizedMeshLoaderOptions>;
//# sourceMappingURL=quantized-mesh-loader.d.ts.map