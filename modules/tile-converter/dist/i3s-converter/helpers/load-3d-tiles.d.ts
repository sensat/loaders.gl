import type { Tiles3DLoaderOptions, Tiles3DTileContent, Tiles3DTileJSONPostprocessed, Tiles3DTilesetJSONPostprocessed } from '@loaders.gl/3d-tiles';
/**
 * Load nested 3DTiles tileset. If the sourceTile is not nested tileset - do nothing
 * @param sourceTileset - source root tileset JSON
 * @param sourceTile - source tile JSON that is supposed to has link to nested tileset
 * @param tilesetLoadOptions - load options for Tiles3DLoader
 * @returns nothing
 */
export declare const loadNestedTileset: (sourceTileset: Tiles3DTilesetJSONPostprocessed | null, sourceTile: Tiles3DTileJSONPostprocessed, tilesetLoadOptions: Tiles3DLoaderOptions) => Promise<void>;
/**
 * Load 3DTiles tile content, that includes glTF object
 * @param sourceTileset - source root tileset JSON
 * @param sourceTile - source tile JSON that has link to content data
 * @param tilesetLoadOptions - load options for Tiles3DLoader
 * @returns - 3DTiles tile content or null
 */
export declare const loadTile3DContent: (sourceTileset: Tiles3DTilesetJSONPostprocessed | null, sourceTile: Tiles3DTileJSONPostprocessed, tilesetLoadOptions: Tiles3DLoaderOptions) => Promise<Tiles3DTileContent | null>;
//# sourceMappingURL=load-3d-tiles.d.ts.map