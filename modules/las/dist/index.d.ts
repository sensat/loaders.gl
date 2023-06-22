import type { LoaderWithParser } from '@loaders.gl/loader-utils';
import type { LASLoaderOptions } from './las-loader';
import type { LASMesh } from './lib/las-types';
import { LASLoader as LASWorkerLoader } from './las-loader';
export type { LASLoaderOptions };
export { LASWorkerLoader };
/**
 * Loader for the LAS (LASer) point cloud format
 */
export declare const LASLoader: LoaderWithParser<LASMesh, never, LASLoaderOptions>;
//# sourceMappingURL=index.d.ts.map