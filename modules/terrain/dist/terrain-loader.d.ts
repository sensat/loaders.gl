import type { Loader } from '@loaders.gl/loader-utils';
import type { ImageLoaderOptions } from '@loaders.gl/images';
import { TerrainOptions } from './lib/parse-terrain';
import { Mesh } from '@loaders.gl/schema';
export type TerrainLoaderOptions = ImageLoaderOptions & {
    terrain?: TerrainOptions;
};
/**
 * Worker loader for image encoded terrain
 */
export declare const TerrainLoader: Loader<Mesh, never, TerrainLoaderOptions>;
//# sourceMappingURL=terrain-loader.d.ts.map