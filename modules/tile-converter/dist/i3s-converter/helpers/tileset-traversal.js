"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseDatasetWith = void 0;
/**
 * Travesal of 3DTile tiles tree with making specific actions with each tile
 * @param tile - 3DTiles tile JSON metadata
 * @param traversalProps - traversal props used to pass data through recursive calls
 * @param processTile - callback to make some actions with the current tile
 * @param postprocessTile - callback to make some action after processing of the current tile and all the subtree
 * @param maxDepth - max recursive calls number the travesal function will do. If not set, the traversal function will
 *                   go through all the tree.
 *                   This value is used to limit the convertion with only partial number of levels of the tileset
 * @param level - counter to keep recursive calls number of the tiles tree. This value used to be able to break
 *                traversal at the some level of the tree
 * @returns void
 */
const traverseDatasetWith = async (tile, traversalProps, processTile, postprocessTile, maxDepth, level = 0) => {
    if (maxDepth && level > maxDepth) {
        return;
    }
    const processResults = [];
    const newTraversalProps = await processTile(tile, traversalProps);
    processResults.push(newTraversalProps);
    for (const childTile of tile.children) {
        await (0, exports.traverseDatasetWith)(childTile, newTraversalProps, processTile, postprocessTile, maxDepth, level + 1);
    }
    postprocessTile && (await postprocessTile(processResults, traversalProps));
};
exports.traverseDatasetWith = traverseDatasetWith;
