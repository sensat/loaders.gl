import type { Loader, LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import { NPYTile } from './lib/parsers/parse-npy';
export type NPYLoaderOptions = LoaderOptions & {
    npy?: {};
};
/**
 * Worker loader for numpy "tiles"
 */
export declare const NPYWorkerLoader: Loader<NPYTile, never, NPYLoaderOptions>;
/**
 * Loader for numpy "tiles"
 */
export declare const NPYLoader: LoaderWithParser<any, any, NPYLoaderOptions>;
//# sourceMappingURL=npy-loader.d.ts.map