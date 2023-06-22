import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
import type { LASMesh } from './lib/las-types';
export type LASLoaderOptions = LoaderOptions & {
    las?: {
        shape?: 'mesh' | 'columnar-table' | 'arrow-table';
        fp64?: boolean;
        skip?: number;
        colorDepth?: number | string;
    };
    onProgress?: Function;
};
/**
 * Loader for the LAS (LASer) point cloud format
 */
export declare const LASLoader: Loader<LASMesh, never, LASLoaderOptions>;
//# sourceMappingURL=las-loader.d.ts.map