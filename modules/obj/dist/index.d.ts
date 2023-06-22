import type { LoaderWithParser } from '@loaders.gl/loader-utils';
import type { Mesh } from '@loaders.gl/schema';
import type { OBJLoaderOptions } from './obj-loader';
import { OBJLoader as OBJWorkerLoader } from './obj-loader';
import type { MTLMaterial } from './lib/parse-mtl';
import type { MTLLoaderOptions } from './mtl-loader';
export { OBJWorkerLoader };
/**
 * Loader for the OBJ geometry format
 */
export declare const OBJLoader: LoaderWithParser<Mesh, never, OBJLoaderOptions>;
/**
 * Loader for the MTL material format
 */
export declare const MTLLoader: LoaderWithParser<MTLMaterial[], never, MTLLoaderOptions>;
export declare const _typecheckOBJLoader: LoaderWithParser;
export declare const _typecheckMTLLoader: LoaderWithParser;
//# sourceMappingURL=index.d.ts.map