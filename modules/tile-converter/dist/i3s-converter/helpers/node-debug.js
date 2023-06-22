"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNodeBoundingVolumes = void 0;
const culling_1 = require("@math.gl/culling");
const core_1 = require("@math.gl/core");
const geospatial_1 = require("@math.gl/geospatial");
// prettier-ignore
const CUBE_POSITIONS = new Float32Array([
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
    -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
    -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
    -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
    1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
    -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1
]);
// TODO Unite Tile validation logic in i3s-17-and-debug with this code.
/**
 * Do validation of bounding volumes for particular node.
 * Generates special warnings if there are some issues.
 * @param node
 */
function validateNodeBoundingVolumes(node) {
    if (!node?.parentNode?.obb || !node?.parentNode?.mbs) {
        return [];
    }
    const tileWarnings = [];
    validateObb(tileWarnings, node);
    validateMbs(tileWarnings, node);
    return tileWarnings;
}
exports.validateNodeBoundingVolumes = validateNodeBoundingVolumes;
/**
 * Check if child Obb fit into parent Obb.
 * @param tileWarnings
 * @param node
 */
function validateObb(tileWarnings, node) {
    // @ts-expect-error
    const parentObb = createBoundingBoxFromTileObb(node.parentNode.obb);
    const tileVertices = getTileObbVertices(node);
    const isTileObbInsideParentObb = isAllVerticesInsideBoundingVolume(parentObb, tileVertices);
    if (isTileObbInsideParentObb) {
        return;
    }
    const title = `OBB of Tile (${node.id}) doesn't fit into Parent (${node.parentNode?.id}) tile OBB`;
    tileWarnings.push(title);
}
/**
 * Check if child Mbs fit into parent Mbs.
 * @param tileWarnings
 * @param node
 */
function validateMbs(tileWarnings, node) {
    // @ts-expect-error
    const tileMbs = createBoundingSphereFromTileMbs(node.mbs);
    // @ts-expect-error
    const parentMbs = createBoundingSphereFromTileMbs(node.parentNode.mbs);
    const distanceBetweenCenters = tileMbs.center.distanceTo(parentMbs.center);
    if (distanceBetweenCenters + tileMbs.radius > parentMbs.radius) {
        const title = `MBS of Tile (${node.id}) doesn't fit into Parent (${node.parentNode?.id}) tile MBS`;
        tileWarnings.push(title);
    }
}
/**
 * Generates bounding sphere from mbs
 * @param mbs
 */
function createBoundingSphereFromTileMbs(mbs) {
    return new culling_1.BoundingSphere([mbs[0], mbs[1], mbs[2]], mbs[3]);
}
/**
 * Generates oriented bounding box from tile obb
 * @param obb
 * @returns
 */
function createBoundingBoxFromTileObb(obb) {
    const { center, halfSize, quaternion } = obb;
    return new culling_1.OrientedBoundingBox().fromCenterHalfSizeQuaternion(center, halfSize, quaternion);
}
/**
 * Get vertices fromnode obb
 * TODO check if Obb generates properly
 * @param node
 */
function getTileObbVertices(node) {
    // @ts-expect-error
    const halfSize = node.obb.halfSize;
    const positions = CUBE_POSITIONS;
    // @ts-expect-error
    const obbCenterCartesian = geospatial_1.Ellipsoid.WGS84.cartographicToCartesian(node.obb.center);
    let vertices = [];
    for (let i = 0; i < positions.length; i += 3) {
        const positionsVector = new core_1.Vector3((positions[i] *= halfSize[0]), (positions[i + 1] *= halfSize[1]), (positions[i + 2] *= halfSize[2]));
        const rotatedPositions = positionsVector
            // @ts-expect-error
            .transformByQuaternion(node.obb.quaternion)
            .add(obbCenterCartesian);
        // @ts-expect-error
        vertices = vertices.concat(rotatedPositions);
    }
    return vertices;
}
/**
 * Check if all vertices inside bounding volume
 * @param boundingVolume
 * @param positions
 */
function isAllVerticesInsideBoundingVolume(boundingVolume, positions) {
    let isVerticesInsideObb = true;
    for (let index = 0; index < positions.length / 3; index += 3) {
        const point = [positions[index], positions[index + 1], positions[index + 2]];
        const cartographicPoint = geospatial_1.Ellipsoid.WGS84.cartesianToCartographic(point);
        const distance = boundingVolume.distanceTo(cartographicPoint);
        if (distance > 0) {
            isVerticesInsideObb = false;
            break;
        }
    }
    return isVerticesInsideObb;
}
