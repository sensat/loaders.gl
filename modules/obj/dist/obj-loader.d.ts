import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
import { Mesh } from '@loaders.gl/schema';
export type OBJLoaderOptions = LoaderOptions & {
    obj?: {};
};
/**
 * Worker loader for the OBJ geometry format
 */
export declare const OBJLoader: Loader<Mesh, never, OBJLoaderOptions>;
export declare const _typecheckOBJLoader: Loader;
//# sourceMappingURL=obj-loader.d.ts.map