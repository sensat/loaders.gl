import type { LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils';
import { PCDLoader as PCDWorkerLoader } from './pcd-loader';
import { PCDMesh } from './lib/pcd-types';
export { PCDWorkerLoader };
/**
 * Loader for PCD - Point Cloud Data
 */
export declare const PCDLoader: LoaderWithParser<PCDMesh, never, LoaderOptions>;
export declare const _typecheckPCDLoader: LoaderWithParser;
//# sourceMappingURL=index.d.ts.map