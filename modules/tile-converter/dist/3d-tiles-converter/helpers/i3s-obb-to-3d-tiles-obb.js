"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i3sObbTo3dTilesObb = void 0;
const core_1 = require("@math.gl/core");
const geospatial_1 = require("@math.gl/geospatial");
const culling_1 = require("@math.gl/culling");
/**
 * Convert quaternion-based OBB to half-axes-based OBB
 * @param i3SObb quaternion based OBB
 * @param geoidHeightModel the Earth Gravity Model instance
 * @returns number[12] 3DTiles OBB https://github.com/CesiumGS/3d-tiles/tree/master/specification#box
 */
function i3sObbTo3dTilesObb(i3SObb, geoidHeightModel) {
    const tiles3DCenter = [
        i3SObb.center[0],
        i3SObb.center[1],
        i3SObb.center[2] + geoidHeightModel.getHeight(i3SObb.center[1], i3SObb.center[0])
    ];
    const cartesianCenter = geospatial_1.Ellipsoid.WGS84.cartographicToCartesian(tiles3DCenter, new core_1.Vector3());
    const tiles3DObb = new culling_1.OrientedBoundingBox().fromCenterHalfSizeQuaternion(cartesianCenter, i3SObb.halfSize, i3SObb.quaternion);
    return [...tiles3DObb.center, ...tiles3DObb.halfAxes.toArray()];
}
exports.i3sObbTo3dTilesObb = i3sObbTo3dTilesObb;
