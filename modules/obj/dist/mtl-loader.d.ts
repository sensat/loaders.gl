import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
import type { MTLMaterial, ParseMTLOptions } from './lib/parse-mtl';
export type MTLLoaderOptions = LoaderOptions & {
    mtl?: ParseMTLOptions;
};
/**
 * Loader for the MTL material format
 * Parses a Wavefront .mtl file specifying materials
 */
export declare const MTLLoader: Loader<MTLMaterial[], never, LoaderOptions>;
export declare const _typecheckMTLLoader: Loader;
//# sourceMappingURL=mtl-loader.d.ts.map