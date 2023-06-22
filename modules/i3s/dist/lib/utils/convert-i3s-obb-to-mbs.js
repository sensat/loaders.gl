"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertI3SObbToMbs = void 0;
const culling_1 = require("@math.gl/culling");
const geospatial_1 = require("@math.gl/geospatial");
function convertI3SObbToMbs(obb) {
    const halfSize = obb.halfSize;
    const centerCartesian = geospatial_1.Ellipsoid.WGS84.cartographicToCartesian(obb.center);
    const sphere = new culling_1.BoundingSphere().fromCornerPoints([
        centerCartesian[0] - halfSize[0],
        centerCartesian[1] - halfSize[1],
        centerCartesian[2] - halfSize[2]
    ], [
        centerCartesian[0] + halfSize[0],
        centerCartesian[1] + halfSize[1],
        centerCartesian[2] + halfSize[2]
    ]);
    return [...obb.center, sphere.radius];
}
exports.convertI3SObbToMbs = convertI3SObbToMbs;
