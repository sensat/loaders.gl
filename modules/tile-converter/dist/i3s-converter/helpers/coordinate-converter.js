"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObbFromMbs = exports.convertBoundingVolumeToI3SFullExtent = exports.convertPositionsToVectors = exports.createBoundingVolumesFromGeometry = exports.createBoundingVolumes = void 0;
const core_1 = require("@math.gl/core");
const geospatial_1 = require("@math.gl/geospatial");
const culling_1 = require("@math.gl/culling");
/**
 * Create bounding volumes object from tile and geoid height model.
 * @param tile
 * @param geoidHeightModel
 * @returns - Bounding volumes object
 */
function createBoundingVolumes(tile, geoidHeightModel) {
    let radius;
    let halfSize;
    let quaternion;
    const boundingVolume = tile.boundingVolume;
    const cartographicCenter = geospatial_1.Ellipsoid.WGS84.cartesianToCartographic(boundingVolume.center, new core_1.Vector3());
    cartographicCenter[2] =
        cartographicCenter[2] -
            geoidHeightModel.getHeight(cartographicCenter[1], cartographicCenter[0]);
    if (boundingVolume instanceof culling_1.OrientedBoundingBox) {
        halfSize = boundingVolume.halfSize;
        radius = new core_1.Vector3(halfSize[0], halfSize[1], halfSize[2]).len();
        quaternion = boundingVolume.quaternion;
    }
    else {
        radius = tile.boundingVolume.radius;
        halfSize = [radius, radius, radius];
        quaternion = new core_1.Quaternion()
            .fromMatrix3(new core_1.Matrix3([halfSize[0], 0, 0, 0, halfSize[1], 0, 0, 0, halfSize[2]]))
            .normalize();
    }
    return {
        mbs: [cartographicCenter[0], cartographicCenter[1], cartographicCenter[2], radius],
        obb: {
            center: [cartographicCenter[0], cartographicCenter[1], cartographicCenter[2]],
            halfSize,
            quaternion
        }
    };
}
exports.createBoundingVolumes = createBoundingVolumes;
/**
 * Generates bounding volumes from geometry positions
 * @param cartesianPositions
 * @param geoidHeightModel
 */
function createBoundingVolumesFromGeometry(cartesianPositions, geoidHeightModel) {
    const positionVectors = convertPositionsToVectors(cartesianPositions);
    const geometryObb = (0, culling_1.makeOrientedBoundingBoxFromPoints)(positionVectors);
    const geometryMbs = (0, culling_1.makeBoundingSphereFromPoints)(positionVectors);
    let mbsCenter = geospatial_1.Ellipsoid.WGS84.cartesianToCartographic(geometryMbs.center, new core_1.Vector3());
    let obbCenter = geospatial_1.Ellipsoid.WGS84.cartesianToCartographic(geometryObb.center, new core_1.Vector3());
    mbsCenter[2] = mbsCenter[2] - geoidHeightModel.getHeight(mbsCenter[1], mbsCenter[0]);
    obbCenter[2] = obbCenter[2] - geoidHeightModel.getHeight(obbCenter[1], obbCenter[0]);
    return {
        mbs: [mbsCenter[0], mbsCenter[1], mbsCenter[2], geometryMbs.radius],
        obb: {
            center: obbCenter,
            halfSize: geometryObb.halfSize,
            quaternion: geometryObb.quaternion
        }
    };
}
exports.createBoundingVolumesFromGeometry = createBoundingVolumesFromGeometry;
/**
 * Create array of posisitons where each vertex is vector
 * @param {array} positions
 * @returns {Vector3[]}
 */
function convertPositionsToVectors(positions) {
    const result = [];
    for (let i = 0; i < positions.length; i += 3) {
        // TODO: (perf) new Vector3 is not optimal but required in `makeOrientedBoundingBoxFromPoints`.
        // modify `makeOrientedBoundingBoxFromPoints` to use scratch vectors
        const positionVector = new core_1.Vector3([positions[i], positions[i + 1], positions[i + 2]]);
        result.push(positionVector);
    }
    return result;
}
exports.convertPositionsToVectors = convertPositionsToVectors;
/**
 * Convert common coordinate to fullExtent https://github.com/Esri/i3s-spec/blob/master/docs/1.8/fullExtent.cmn.md
 * @param
 * @param boundingVolume
 * @returns - fullExtent object
 */
function convertBoundingVolumeToI3SFullExtent(boundingVolume) {
    let sphere;
    if (boundingVolume instanceof culling_1.BoundingSphere) {
        sphere = boundingVolume;
    }
    else {
        sphere = boundingVolume.getBoundingSphere();
    }
    const center = sphere.center;
    const radius = sphere.radius;
    const vertexMax = geospatial_1.Ellipsoid.WGS84.cartesianToCartographic(new core_1.Vector3(center[0] + radius, center[1] + radius, center[2] + radius), new core_1.Vector3());
    const vertexMin = geospatial_1.Ellipsoid.WGS84.cartesianToCartographic(new core_1.Vector3(center[0] - radius, center[1] - radius, center[2] - radius), new core_1.Vector3());
    // Converter sometimes returns min values that are bigger then max,
    // so we should check and take bigger value from max and smaller for nim
    return {
        xmin: Math.min(vertexMin[0], vertexMax[0]),
        xmax: Math.max(vertexMin[0], vertexMax[0]),
        ymin: Math.min(vertexMin[1], vertexMax[1]),
        ymax: Math.max(vertexMin[1], vertexMax[1]),
        zmin: Math.min(vertexMin[2], vertexMax[2]),
        zmax: Math.max(vertexMin[2], vertexMax[2])
    };
}
exports.convertBoundingVolumeToI3SFullExtent = convertBoundingVolumeToI3SFullExtent;
/**
 * Creates oriented boundinb box from mbs.
 * @param mbs - Minimum Bounding Sphere
 * @returns - Oriented BOunding Box
 */
function createObbFromMbs(mbs) {
    const radius = mbs[3];
    const center = new core_1.Vector3(mbs[0], mbs[1], mbs[2]);
    const halfAxex = new core_1.Matrix3([radius, 0, 0, 0, radius, 0, 0, 0, radius]);
    return new culling_1.OrientedBoundingBox(center, halfAxex);
}
exports.createObbFromMbs = createObbFromMbs;
