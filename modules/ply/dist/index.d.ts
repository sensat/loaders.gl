import type { LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils';
import type { PLYMesh } from './lib/ply-types';
import { PLYLoader as PLYWorkerLoader } from './ply-loader';
import { ParsePLYOptions } from './lib/parse-ply';
export { PLYWorkerLoader };
export type PLYLoaderOptions = LoaderOptions & {
    ply?: ParsePLYOptions;
};
/**
 * Loader for PLY - Polygon File Format
 */
export declare const PLYLoader: LoaderWithParser<PLYMesh, any, PLYLoaderOptions>;
//# sourceMappingURL=index.d.ts.map