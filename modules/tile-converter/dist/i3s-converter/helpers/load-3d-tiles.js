"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTile3DContent = exports.loadNestedTileset = void 0;
const core_1 = require("@loaders.gl/core");
/**
 * Load nested 3DTiles tileset. If the sourceTile is not nested tileset - do nothing
 * @param sourceTileset - source root tileset JSON
 * @param sourceTile - source tile JSON that is supposed to has link to nested tileset
 * @param tilesetLoadOptions - load options for Tiles3DLoader
 * @returns nothing
 */
const loadNestedTileset = async (sourceTileset, sourceTile, tilesetLoadOptions) => {
    const isTileset = sourceTile.type === 'json';
    if (!sourceTileset || !sourceTile.contentUrl || !isTileset) {
        return;
    }
    const loadOptions = {
        ...tilesetLoadOptions,
        [sourceTileset.loader.id]: {
            isTileset,
            assetGltfUpAxis: (sourceTileset.asset && sourceTileset.asset.gltfUpAxis) || 'Y'
        }
    };
    const tileContent = await (0, core_1.load)(sourceTile.contentUrl, sourceTileset.loader, loadOptions);
    if (tileContent.root) {
        sourceTile.children = [tileContent.root];
    }
};
exports.loadNestedTileset = loadNestedTileset;
/**
 * Load 3DTiles tile content, that includes glTF object
 * @param sourceTileset - source root tileset JSON
 * @param sourceTile - source tile JSON that has link to content data
 * @param tilesetLoadOptions - load options for Tiles3DLoader
 * @returns - 3DTiles tile content or null
 */
const loadTile3DContent = async (sourceTileset, sourceTile, tilesetLoadOptions) => {
    const isTileset = sourceTile.type === 'json';
    if (!sourceTileset || !sourceTile.contentUrl || isTileset) {
        return null;
    }
    const loadOptions = {
        ...tilesetLoadOptions,
        [sourceTileset.loader.id]: {
            ...(tilesetLoadOptions[sourceTileset.loader.id] || {}),
            isTileset,
            assetGltfUpAxis: (sourceTileset.asset && sourceTileset.asset.gltfUpAxis) || 'Y'
        }
    };
    const tileContent = await (0, core_1.load)(sourceTile.contentUrl, sourceTileset.loader, loadOptions);
    return tileContent;
};
exports.loadTile3DContent = loadTile3DContent;
