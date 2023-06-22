import type { LoaderContext, LoaderWithParser } from '@loaders.gl/loader-utils';
import { TerrainLoader as TerrainWorkerLoader, TerrainLoaderOptions } from './terrain-loader';
import { QuantizedMeshLoader as QuantizedMeshWorkerLoader, QuantizedMeshLoaderOptions } from './quantized-mesh-loader';
export { TerrainWorkerLoader };
export declare const TerrainLoader: LoaderWithParser<any, never, TerrainLoaderOptions>;
export declare function parseTerrain(arrayBuffer: ArrayBuffer, options?: TerrainLoaderOptions, context?: LoaderContext): Promise<{
    loaderData: {
        header: {};
    };
    header: {
        vertexCount: any;
        boundingBox: [[number, number, number], [number, number, number]];
    };
    mode: number;
    indices: {
        value: Uint32Array;
        size: number;
    };
    attributes: {
        POSITION: {
            value: Float32Array;
            size: number;
        };
        TEXCOORD_0: {
            value: Float32Array;
            size: number;
        };
    };
}>;
export { QuantizedMeshWorkerLoader };
/**
 * Loader for quantized meshes
 */
export declare const QuantizedMeshLoader: LoaderWithParser<any, never, QuantizedMeshLoaderOptions>;
//# sourceMappingURL=index.d.ts.map