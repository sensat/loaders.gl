import { OrientedBoundingBox } from '@math.gl/culling';
import { Ellipsoid } from '@math.gl/geospatial';
import { load } from '@loaders.gl/core';
import { TILE_TYPE, TILE_REFINEMENT, TILESET_TYPE } from '@loaders.gl/tiles';
import I3SNodePagesTiles from '../helpers/i3s-nodepages-tiles';
import { generateTileAttributeUrls, getUrlWithToken } from '../utils/url-utils';
export function normalizeTileData(tile, context) {
  const url = context.url || '';
  let contentUrl;
  if (tile.geometryData) {
    contentUrl = "".concat(url, "/").concat(tile.geometryData[0].href);
  }
  let textureUrl;
  if (tile.textureData) {
    textureUrl = "".concat(url, "/").concat(tile.textureData[0].href);
  }
  let attributeUrls;
  if (tile.attributeData) {
    attributeUrls = generateTileAttributeUrls(url, tile);
  }
  return normalizeTileNonUrlData({
    ...tile,
    url,
    contentUrl,
    textureUrl,
    attributeUrls,
    isDracoGeometry: false
  });
}
export function normalizeTileNonUrlData(tile) {
  var _tile$lodSelection, _tile$lodSelection2;
  const boundingVolume = {};
  let mbs = [0, 0, 0, 1];
  if (tile.mbs) {
    mbs = tile.mbs;
    boundingVolume.sphere = [...Ellipsoid.WGS84.cartographicToCartesian(tile.mbs.slice(0, 3)), tile.mbs[3]];
  } else if (tile.obb) {
    boundingVolume.box = [...Ellipsoid.WGS84.cartographicToCartesian(tile.obb.center), ...tile.obb.halfSize, ...tile.obb.quaternion];
    const obb = new OrientedBoundingBox().fromCenterHalfSizeQuaternion(boundingVolume.box.slice(0, 3), tile.obb.halfSize, tile.obb.quaternion);
    const boundingSphere = obb.getBoundingSphere();
    boundingVolume.sphere = [...boundingSphere.center, boundingSphere.radius];
    mbs = [...tile.obb.center, boundingSphere.radius];
  }
  const lodMetricType = (_tile$lodSelection = tile.lodSelection) === null || _tile$lodSelection === void 0 ? void 0 : _tile$lodSelection[0].metricType;
  const lodMetricValue = (_tile$lodSelection2 = tile.lodSelection) === null || _tile$lodSelection2 === void 0 ? void 0 : _tile$lodSelection2[0].maxError;
  const transformMatrix = tile.transform;
  const type = TILE_TYPE.MESH;
  const refine = TILE_REFINEMENT.REPLACE;
  return {
    ...tile,
    mbs,
    boundingVolume,
    lodMetricType,
    lodMetricValue,
    transformMatrix,
    type,
    refine
  };
}
export async function normalizeTilesetData(tileset, options, context) {
  tileset.url = context.url;
  if (tileset.nodePages) {
    tileset.nodePagesTile = new I3SNodePagesTiles(tileset, options);
    tileset.root = tileset.nodePagesTile.formTileFromNodePages(0);
  } else {
    var _options$i3s;
    const rootNodeUrl = getUrlWithToken("".concat(tileset.url, "/nodes/root"), (_options$i3s = options.i3s) === null || _options$i3s === void 0 ? void 0 : _options$i3s.token);
    tileset.root = await load(rootNodeUrl, tileset.loader, {
      ...options,
      i3s: {
        ...options.i3s,
        loadContent: false,
        isTileHeader: true,
        isTileset: false
      }
    });
  }
  tileset.basePath = tileset.url;
  tileset.type = TILESET_TYPE.I3S;
  tileset.lodMetricType = tileset.root.lodMetricType;
  tileset.lodMetricValue = tileset.root.lodMetricValue;
}
//# sourceMappingURL=parse-i3s.js.map