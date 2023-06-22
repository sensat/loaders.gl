import type { MeshAttribute } from '@loaders.gl/schema';
import type { I3STileOptions, I3STilesetOptions } from '../../types';
import { I3SLoaderOptions } from '../../i3s-loader';
/**
 * Modify vertex colors array to visualize 3D objects in a attribute driven way
 * @param colors - vertex colors attribute
 * @param featureIds - feature Ids attribute
 * @param tileOptions - tile - related options
 * @param tilesetOptions - tileset-related options
 * @param options - loader options
 * @returns midified colors attribute
 */
export declare function customizeColors(colors: MeshAttribute, featureIds: MeshAttribute, tileOptions: I3STileOptions, tilesetOptions: I3STilesetOptions, options?: I3SLoaderOptions): Promise<MeshAttribute>;
//# sourceMappingURL=customizeColors.d.ts.map