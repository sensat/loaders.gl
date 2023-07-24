import { load } from '@loaders.gl/core';
export const loadNestedTileset = async (sourceTileset, sourceTile, tilesetLoadOptions) => {
  const isTileset = sourceTile.type === 'json';
  if (!sourceTileset || !sourceTile.contentUrl || !isTileset) {
    return;
  }
  const loadOptions = {
    ...tilesetLoadOptions,
    [sourceTileset.loader.id]: {
      isTileset,
      assetGltfUpAxis: sourceTileset.asset && sourceTileset.asset.gltfUpAxis || 'Y'
    }
  };
  const tileContent = await load(sourceTile.contentUrl, sourceTileset.loader, loadOptions);
  if (tileContent.root) {
    sourceTile.children = [tileContent.root];
  }
};
export const loadTile3DContent = async (sourceTileset, sourceTile, tilesetLoadOptions) => {
  const isTileset = sourceTile.type === 'json';
  if (!sourceTileset || !sourceTile.contentUrl || isTileset) {
    return null;
  }
  const loadOptions = {
    ...tilesetLoadOptions,
    [sourceTileset.loader.id]: {
      ...(tilesetLoadOptions[sourceTileset.loader.id] || {}),
      isTileset,
      assetGltfUpAxis: sourceTileset.asset && sourceTileset.asset.gltfUpAxis || 'Y'
    }
  };
  const tileContent = await load(sourceTile.contentUrl, sourceTileset.loader, loadOptions);
  return tileContent;
};
//# sourceMappingURL=load-3d-tiles.js.map