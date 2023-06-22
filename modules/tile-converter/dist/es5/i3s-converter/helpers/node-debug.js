"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNodeBoundingVolumes = validateNodeBoundingVolumes;
var _culling = require("@math.gl/culling");
var _core = require("@math.gl/core");
var _geospatial = require("@math.gl/geospatial");
var CUBE_POSITIONS = new Float32Array([-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1]);
function validateNodeBoundingVolumes(node) {
  var _node$parentNode, _node$parentNode2;
  if (!(node !== null && node !== void 0 && (_node$parentNode = node.parentNode) !== null && _node$parentNode !== void 0 && _node$parentNode.obb) || !(node !== null && node !== void 0 && (_node$parentNode2 = node.parentNode) !== null && _node$parentNode2 !== void 0 && _node$parentNode2.mbs)) {
    return [];
  }
  var tileWarnings = [];
  validateObb(tileWarnings, node);
  validateMbs(tileWarnings, node);
  return tileWarnings;
}
function validateObb(tileWarnings, node) {
  var _node$parentNode3;
  var parentObb = createBoundingBoxFromTileObb(node.parentNode.obb);
  var tileVertices = getTileObbVertices(node);
  var isTileObbInsideParentObb = isAllVerticesInsideBoundingVolume(parentObb, tileVertices);
  if (isTileObbInsideParentObb) {
    return;
  }
  var title = "OBB of Tile (".concat(node.id, ") doesn't fit into Parent (").concat((_node$parentNode3 = node.parentNode) === null || _node$parentNode3 === void 0 ? void 0 : _node$parentNode3.id, ") tile OBB");
  tileWarnings.push(title);
}
function validateMbs(tileWarnings, node) {
  var tileMbs = createBoundingSphereFromTileMbs(node.mbs);
  var parentMbs = createBoundingSphereFromTileMbs(node.parentNode.mbs);
  var distanceBetweenCenters = tileMbs.center.distanceTo(parentMbs.center);
  if (distanceBetweenCenters + tileMbs.radius > parentMbs.radius) {
    var _node$parentNode4;
    var title = "MBS of Tile (".concat(node.id, ") doesn't fit into Parent (").concat((_node$parentNode4 = node.parentNode) === null || _node$parentNode4 === void 0 ? void 0 : _node$parentNode4.id, ") tile MBS");
    tileWarnings.push(title);
  }
}
function createBoundingSphereFromTileMbs(mbs) {
  return new _culling.BoundingSphere([mbs[0], mbs[1], mbs[2]], mbs[3]);
}
function createBoundingBoxFromTileObb(obb) {
  var center = obb.center,
    halfSize = obb.halfSize,
    quaternion = obb.quaternion;
  return new _culling.OrientedBoundingBox().fromCenterHalfSizeQuaternion(center, halfSize, quaternion);
}
function getTileObbVertices(node) {
  var halfSize = node.obb.halfSize;
  var positions = CUBE_POSITIONS;
  var obbCenterCartesian = _geospatial.Ellipsoid.WGS84.cartographicToCartesian(node.obb.center);
  var vertices = [];
  for (var i = 0; i < positions.length; i += 3) {
    var positionsVector = new _core.Vector3(positions[i] *= halfSize[0], positions[i + 1] *= halfSize[1], positions[i + 2] *= halfSize[2]);
    var rotatedPositions = positionsVector.transformByQuaternion(node.obb.quaternion).add(obbCenterCartesian);
    vertices = vertices.concat(rotatedPositions);
  }
  return vertices;
}
function isAllVerticesInsideBoundingVolume(boundingVolume, positions) {
  var isVerticesInsideObb = true;
  for (var index = 0; index < positions.length / 3; index += 3) {
    var point = [positions[index], positions[index + 1], positions[index + 2]];
    var cartographicPoint = _geospatial.Ellipsoid.WGS84.cartesianToCartographic(point);
    var distance = boundingVolume.distanceTo(cartographicPoint);
    if (distance > 0) {
      isVerticesInsideObb = false;
      break;
    }
  }
  return isVerticesInsideObb;
}
//# sourceMappingURL=node-debug.js.map