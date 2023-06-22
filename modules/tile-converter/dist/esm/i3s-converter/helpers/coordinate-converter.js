import { Matrix3, Quaternion, Vector3 } from '@math.gl/core';
import { Ellipsoid } from '@math.gl/geospatial';
import { OrientedBoundingBox, makeOrientedBoundingBoxFromPoints, makeBoundingSphereFromPoints, BoundingSphere } from '@math.gl/culling';
export function createBoundingVolumes(tile, geoidHeightModel) {
  let radius;
  let halfSize;
  let quaternion;
  const boundingVolume = tile.boundingVolume;
  const cartographicCenter = Ellipsoid.WGS84.cartesianToCartographic(boundingVolume.center, new Vector3());
  cartographicCenter[2] = cartographicCenter[2] - geoidHeightModel.getHeight(cartographicCenter[1], cartographicCenter[0]);
  if (boundingVolume instanceof OrientedBoundingBox) {
    halfSize = boundingVolume.halfSize;
    radius = new Vector3(halfSize[0], halfSize[1], halfSize[2]).len();
    quaternion = boundingVolume.quaternion;
  } else {
    radius = tile.boundingVolume.radius;
    halfSize = [radius, radius, radius];
    quaternion = new Quaternion().fromMatrix3(new Matrix3([halfSize[0], 0, 0, 0, halfSize[1], 0, 0, 0, halfSize[2]])).normalize();
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
export function createBoundingVolumesFromGeometry(cartesianPositions, geoidHeightModel) {
  const positionVectors = convertPositionsToVectors(cartesianPositions);
  const geometryObb = makeOrientedBoundingBoxFromPoints(positionVectors);
  const geometryMbs = makeBoundingSphereFromPoints(positionVectors);
  let mbsCenter = Ellipsoid.WGS84.cartesianToCartographic(geometryMbs.center, new Vector3());
  let obbCenter = Ellipsoid.WGS84.cartesianToCartographic(geometryObb.center, new Vector3());
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
export function convertPositionsToVectors(positions) {
  const result = [];
  for (let i = 0; i < positions.length; i += 3) {
    const positionVector = new Vector3([positions[i], positions[i + 1], positions[i + 2]]);
    result.push(positionVector);
  }
  return result;
}
export function convertBoundingVolumeToI3SFullExtent(boundingVolume) {
  let sphere;
  if (boundingVolume instanceof BoundingSphere) {
    sphere = boundingVolume;
  } else {
    sphere = boundingVolume.getBoundingSphere();
  }
  const center = sphere.center;
  const radius = sphere.radius;
  const vertexMax = Ellipsoid.WGS84.cartesianToCartographic(new Vector3(center[0] + radius, center[1] + radius, center[2] + radius), new Vector3());
  const vertexMin = Ellipsoid.WGS84.cartesianToCartographic(new Vector3(center[0] - radius, center[1] - radius, center[2] - radius), new Vector3());
  return {
    xmin: Math.min(vertexMin[0], vertexMax[0]),
    xmax: Math.max(vertexMin[0], vertexMax[0]),
    ymin: Math.min(vertexMin[1], vertexMax[1]),
    ymax: Math.max(vertexMin[1], vertexMax[1]),
    zmin: Math.min(vertexMin[2], vertexMax[2]),
    zmax: Math.max(vertexMin[2], vertexMax[2])
  };
}
export function createObbFromMbs(mbs) {
  const radius = mbs[3];
  const center = new Vector3(mbs[0], mbs[1], mbs[2]);
  const halfAxex = new Matrix3([radius, 0, 0, 0, radius, 0, 0, 0, radius]);
  return new OrientedBoundingBox(center, halfAxex);
}
//# sourceMappingURL=coordinate-converter.js.map