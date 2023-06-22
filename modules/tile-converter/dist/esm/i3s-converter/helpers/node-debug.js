import { OrientedBoundingBox, BoundingSphere } from '@math.gl/culling';
import { Vector3 } from '@math.gl/core';
import { Ellipsoid } from '@math.gl/geospatial';
const CUBE_POSITIONS = new Float32Array([-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1]);
export function validateNodeBoundingVolumes(node) {
  var _node$parentNode, _node$parentNode2;
  if (!(node !== null && node !== void 0 && (_node$parentNode = node.parentNode) !== null && _node$parentNode !== void 0 && _node$parentNode.obb) || !(node !== null && node !== void 0 && (_node$parentNode2 = node.parentNode) !== null && _node$parentNode2 !== void 0 && _node$parentNode2.mbs)) {
    return [];
  }
  const tileWarnings = [];
  validateObb(tileWarnings, node);
  validateMbs(tileWarnings, node);
  return tileWarnings;
}
function validateObb(tileWarnings, node) {
  var _node$parentNode3;
  const parentObb = createBoundingBoxFromTileObb(node.parentNode.obb);
  const tileVertices = getTileObbVertices(node);
  const isTileObbInsideParentObb = isAllVerticesInsideBoundingVolume(parentObb, tileVertices);
  if (isTileObbInsideParentObb) {
    return;
  }
  const title = "OBB of Tile (".concat(node.id, ") doesn't fit into Parent (").concat((_node$parentNode3 = node.parentNode) === null || _node$parentNode3 === void 0 ? void 0 : _node$parentNode3.id, ") tile OBB");
  tileWarnings.push(title);
}
function validateMbs(tileWarnings, node) {
  const tileMbs = createBoundingSphereFromTileMbs(node.mbs);
  const parentMbs = createBoundingSphereFromTileMbs(node.parentNode.mbs);
  const distanceBetweenCenters = tileMbs.center.distanceTo(parentMbs.center);
  if (distanceBetweenCenters + tileMbs.radius > parentMbs.radius) {
    var _node$parentNode4;
    const title = "MBS of Tile (".concat(node.id, ") doesn't fit into Parent (").concat((_node$parentNode4 = node.parentNode) === null || _node$parentNode4 === void 0 ? void 0 : _node$parentNode4.id, ") tile MBS");
    tileWarnings.push(title);
  }
}
function createBoundingSphereFromTileMbs(mbs) {
  return new BoundingSphere([mbs[0], mbs[1], mbs[2]], mbs[3]);
}
function createBoundingBoxFromTileObb(obb) {
  const {
    center,
    halfSize,
    quaternion
  } = obb;
  return new OrientedBoundingBox().fromCenterHalfSizeQuaternion(center, halfSize, quaternion);
}
function getTileObbVertices(node) {
  const halfSize = node.obb.halfSize;
  const positions = CUBE_POSITIONS;
  const obbCenterCartesian = Ellipsoid.WGS84.cartographicToCartesian(node.obb.center);
  let vertices = [];
  for (let i = 0; i < positions.length; i += 3) {
    const positionsVector = new Vector3(positions[i] *= halfSize[0], positions[i + 1] *= halfSize[1], positions[i + 2] *= halfSize[2]);
    const rotatedPositions = positionsVector.transformByQuaternion(node.obb.quaternion).add(obbCenterCartesian);
    vertices = vertices.concat(rotatedPositions);
  }
  return vertices;
}
function isAllVerticesInsideBoundingVolume(boundingVolume, positions) {
  let isVerticesInsideObb = true;
  for (let index = 0; index < positions.length / 3; index += 3) {
    const point = [positions[index], positions[index + 1], positions[index + 2]];
    const cartographicPoint = Ellipsoid.WGS84.cartesianToCartographic(point);
    const distance = boundingVolume.distanceTo(cartographicPoint);
    if (distance > 0) {
      isVerticesInsideObb = false;
      break;
    }
  }
  return isVerticesInsideObb;
}
//# sourceMappingURL=node-debug.js.map