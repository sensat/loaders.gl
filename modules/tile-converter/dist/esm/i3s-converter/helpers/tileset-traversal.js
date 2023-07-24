export const traverseDatasetWith = async function (tile, traversalProps, processTile, postprocessTile, maxDepth) {
  let level = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  if (maxDepth && level > maxDepth) {
    return;
  }
  const processResults = [];
  const newTraversalProps = await processTile(tile, traversalProps);
  processResults.push(newTraversalProps);
  for (const childTile of tile.children) {
    await traverseDatasetWith(childTile, newTraversalProps, processTile, postprocessTile, maxDepth, level + 1);
  }
  postprocessTile && (await postprocessTile(processResults, traversalProps));
};
//# sourceMappingURL=tileset-traversal.js.map