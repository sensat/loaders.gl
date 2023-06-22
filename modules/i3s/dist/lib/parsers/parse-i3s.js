"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTilesetData = exports.normalizeTileNonUrlData = exports.normalizeTileData = void 0;
const culling_1 = require("@math.gl/culling");
const geospatial_1 = require("@math.gl/geospatial");
const core_1 = require("@loaders.gl/core");
const tiles_1 = require("@loaders.gl/tiles");
const i3s_nodepages_tiles_1 = __importDefault(require("../helpers/i3s-nodepages-tiles"));
const url_utils_1 = require("../utils/url-utils");
function normalizeTileData(tile, context) {
    const url = context.url || '';
    let contentUrl;
    if (tile.geometryData) {
        contentUrl = `${url}/${tile.geometryData[0].href}`;
    }
    let textureUrl;
    if (tile.textureData) {
        textureUrl = `${url}/${tile.textureData[0].href}`;
    }
    let attributeUrls;
    if (tile.attributeData) {
        attributeUrls = (0, url_utils_1.generateTileAttributeUrls)(url, tile);
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
exports.normalizeTileData = normalizeTileData;
function normalizeTileNonUrlData(tile) {
    const boundingVolume = {};
    let mbs = [0, 0, 0, 1];
    if (tile.mbs) {
        mbs = tile.mbs;
        boundingVolume.sphere = [
            ...geospatial_1.Ellipsoid.WGS84.cartographicToCartesian(tile.mbs.slice(0, 3)),
            tile.mbs[3] // radius of sphere
        ];
    }
    else if (tile.obb) {
        boundingVolume.box = [
            ...geospatial_1.Ellipsoid.WGS84.cartographicToCartesian(tile.obb.center),
            ...tile.obb.halfSize,
            ...tile.obb.quaternion // quaternion
        ];
        const obb = new culling_1.OrientedBoundingBox().fromCenterHalfSizeQuaternion(boundingVolume.box.slice(0, 3), tile.obb.halfSize, tile.obb.quaternion);
        const boundingSphere = obb.getBoundingSphere();
        boundingVolume.sphere = [...boundingSphere.center, boundingSphere.radius];
        mbs = [...tile.obb.center, boundingSphere.radius];
    }
    const lodMetricType = tile.lodSelection?.[0].metricType;
    const lodMetricValue = tile.lodSelection?.[0].maxError;
    const transformMatrix = tile.transform;
    const type = tiles_1.TILE_TYPE.MESH;
    /**
     * I3S specification supports only REPLACE
     */
    const refine = tiles_1.TILE_REFINEMENT.REPLACE;
    return { ...tile, mbs, boundingVolume, lodMetricType, lodMetricValue, transformMatrix, type, refine };
}
exports.normalizeTileNonUrlData = normalizeTileNonUrlData;
async function normalizeTilesetData(tileset, options, context) {
    tileset.url = context.url;
    if (tileset.nodePages) {
        tileset.nodePagesTile = new i3s_nodepages_tiles_1.default(tileset, options);
        tileset.root = tileset.nodePagesTile.formTileFromNodePages(0);
    }
    else {
        // @ts-expect-error options is not properly typed
        const rootNodeUrl = (0, url_utils_1.getUrlWithToken)(`${tileset.url}/nodes/root`, options.i3s?.token);
        // eslint-disable-next-line no-use-before-define
        tileset.root = await (0, core_1.load)(rootNodeUrl, tileset.loader, {
            ...options,
            i3s: {
                // @ts-expect-error options is not properly typed
                ...options.i3s,
                loadContent: false, isTileHeader: true, isTileset: false
            }
        });
    }
    // base path that non-absolute paths in tileset are relative to.
    tileset.basePath = tileset.url;
    tileset.type = tiles_1.TILESET_TYPE.I3S;
    // populate from root node
    tileset.lodMetricType = tileset.root.lodMetricType;
    tileset.lodMetricValue = tileset.root.lodMetricValue;
}
exports.normalizeTilesetData = normalizeTilesetData;
