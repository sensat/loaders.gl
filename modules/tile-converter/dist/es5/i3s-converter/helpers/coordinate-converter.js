"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertBoundingVolumeToI3SFullExtent = convertBoundingVolumeToI3SFullExtent;
exports.convertPositionsToVectors = convertPositionsToVectors;
exports.createBoundingVolumes = createBoundingVolumes;
exports.createBoundingVolumesFromGeometry = createBoundingVolumesFromGeometry;
exports.createObbFromMbs = createObbFromMbs;
var _core = require("@math.gl/core");
var _geospatial = require("@math.gl/geospatial");
var _culling = require("@math.gl/culling");
function createBoundingVolumes(tile, geoidHeightModel) {
  var radius;
  var halfSize;
  var quaternion;
  var boundingVolume = tile.boundingVolume;
  var cartographicCenter = _geospatial.Ellipsoid.WGS84.cartesianToCartographic(boundingVolume.center, new _core.Vector3());
  cartographicCenter[2] = cartographicCenter[2] - geoidHeightModel.getHeight(cartographicCenter[1], cartographicCenter[0]);
  if (boundingVolume instanceof _culling.OrientedBoundingBox) {
    halfSize = boundingVolume.halfSize;
    radius = new _core.Vector3(halfSize[0], halfSize[1], halfSize[2]).len();
    quaternion = boundingVolume.quaternion;
  } else {
    radius = tile.boundingVolume.radius;
    halfSize = [radius, radius, radius];
    quaternion = new _core.Quaternion().fromMatrix3(new _core.Matrix3([halfSize[0], 0, 0, 0, halfSize[1], 0, 0, 0, halfSize[2]])).normalize();
  }
  return {
    mbs: [cartographicCenter[0], cartographicCenter[1], cartographicCenter[2], radius],
    obb: {
      center: [cartographicCenter[0], cartographicCenter[1], cartographicCenter[2]],
      halfSize: halfSize,
      quaternion: quaternion
    }
  };
}
function createBoundingVolumesFromGeometry(cartesianPositions, geoidHeightModel) {
  var positionVectors = convertPositionsToVectors(cartesianPositions);
  var geometryObb = (0, _culling.makeOrientedBoundingBoxFromPoints)(positionVectors);
  var geometryMbs = (0, _culling.makeBoundingSphereFromPoints)(positionVectors);
  var mbsCenter = _geospatial.Ellipsoid.WGS84.cartesianToCartographic(geometryMbs.center, new _core.Vector3());
  var obbCenter = _geospatial.Ellipsoid.WGS84.cartesianToCartographic(geometryObb.center, new _core.Vector3());
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
function convertPositionsToVectors(positions) {
  var result = [];
  for (var i = 0; i < positions.length; i += 3) {
    var positionVector = new _core.Vector3([positions[i], positions[i + 1], positions[i + 2]]);
    result.push(positionVector);
  }
  return result;
}
function convertBoundingVolumeToI3SFullExtent(boundingVolume) {
  var sphere;
  if (boundingVolume instanceof _culling.BoundingSphere) {
    sphere = boundingVolume;
  } else {
    sphere = boundingVolume.getBoundingSphere();
  }
  var center = sphere.center;
  var radius = sphere.radius;
  var vertexMax = _geospatial.Ellipsoid.WGS84.cartesianToCartographic(new _core.Vector3(center[0] + radius, center[1] + radius, center[2] + radius), new _core.Vector3());
  var vertexMin = _geospatial.Ellipsoid.WGS84.cartesianToCartographic(new _core.Vector3(center[0] - radius, center[1] - radius, center[2] - radius), new _core.Vector3());
  return {
    xmin: Math.min(vertexMin[0], vertexMax[0]),
    xmax: Math.max(vertexMin[0], vertexMax[0]),
    ymin: Math.min(vertexMin[1], vertexMax[1]),
    ymax: Math.max(vertexMin[1], vertexMax[1]),
    zmin: Math.min(vertexMin[2], vertexMax[2]),
    zmax: Math.max(vertexMin[2], vertexMax[2])
  };
}
function createObbFromMbs(mbs) {
  var radius = mbs[3];
  var center = new _core.Vector3(mbs[0], mbs[1], mbs[2]);
  var halfAxex = new _core.Matrix3([radius, 0, 0, 0, radius, 0, 0, 0, radius]);
  return new _culling.OrientedBoundingBox(center, halfAxex);
}
//# sourceMappingURL=coordinate-converter.js.map