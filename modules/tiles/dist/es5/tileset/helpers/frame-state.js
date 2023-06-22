"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFrameState = getFrameState;
exports.limitSelectedTiles = limitSelectedTiles;
var _core = require("@math.gl/core");
var _culling = require("@math.gl/culling");
var _geospatial = require("@math.gl/geospatial");
var scratchVector = new _core.Vector3();
var scratchPosition = new _core.Vector3();
var cullingVolume = new _culling.CullingVolume([new _culling.Plane(), new _culling.Plane(), new _culling.Plane(), new _culling.Plane(), new _culling.Plane(), new _culling.Plane()]);
function getFrameState(viewport, frameNumber) {
  var cameraDirection = viewport.cameraDirection,
    cameraUp = viewport.cameraUp,
    height = viewport.height;
  var metersPerUnit = viewport.distanceScales.metersPerUnit;
  var viewportCenterCartesian = worldToCartesian(viewport, viewport.center);
  var enuToFixedTransform = _geospatial.Ellipsoid.WGS84.eastNorthUpToFixedFrame(viewportCenterCartesian);
  var cameraPositionCartographic = viewport.unprojectPosition(viewport.cameraPosition);
  var cameraPositionCartesian = _geospatial.Ellipsoid.WGS84.cartographicToCartesian(cameraPositionCartographic, new _core.Vector3());
  var cameraDirectionCartesian = new _core.Vector3(enuToFixedTransform.transformAsVector(new _core.Vector3(cameraDirection).scale(metersPerUnit))).normalize();
  var cameraUpCartesian = new _core.Vector3(enuToFixedTransform.transformAsVector(new _core.Vector3(cameraUp).scale(metersPerUnit))).normalize();
  commonSpacePlanesToWGS84(viewport);
  var ViewportClass = viewport.constructor;
  var longitude = viewport.longitude,
    latitude = viewport.latitude,
    width = viewport.width,
    bearing = viewport.bearing,
    zoom = viewport.zoom;
  var topDownViewport = new ViewportClass({
    longitude: longitude,
    latitude: latitude,
    height: height,
    width: width,
    bearing: bearing,
    zoom: zoom,
    pitch: 0
  });
  return {
    camera: {
      position: cameraPositionCartesian,
      direction: cameraDirectionCartesian,
      up: cameraUpCartesian
    },
    viewport: viewport,
    topDownViewport: topDownViewport,
    height: height,
    cullingVolume: cullingVolume,
    frameNumber: frameNumber,
    sseDenominator: 1.15
  };
}
function limitSelectedTiles(tiles, maximumTilesSelected) {
  if (maximumTilesSelected === 0 || tiles.length <= maximumTilesSelected) {
    return [tiles, []];
  }
  tiles.sort(function (a, b) {
    return a._screenPriority - b._screenPriority;
  });
  var selectedTiles = tiles.splice(0, maximumTilesSelected);
  return [selectedTiles, tiles];
}
function commonSpacePlanesToWGS84(viewport) {
  var frustumPlanes = viewport.getFrustumPlanes();
  var nearCenterCommon = closestPointOnPlane(frustumPlanes.near, viewport.cameraPosition);
  var nearCenterCartesian = worldToCartesian(viewport, nearCenterCommon);
  var cameraCartesian = worldToCartesian(viewport, viewport.cameraPosition, scratchPosition);
  var i = 0;
  cullingVolume.planes[i++].fromPointNormal(nearCenterCartesian, scratchVector.copy(nearCenterCartesian).subtract(cameraCartesian));
  for (var dir in frustumPlanes) {
    if (dir === 'near') {
      continue;
    }
    var plane = frustumPlanes[dir];
    var posCommon = closestPointOnPlane(plane, nearCenterCommon, scratchPosition);
    var cartesianPos = worldToCartesian(viewport, posCommon, scratchPosition);
    cullingVolume.planes[i++].fromPointNormal(cartesianPos, scratchVector.copy(nearCenterCartesian).subtract(cartesianPos));
  }
}
function closestPointOnPlane(plane, refPoint) {
  var out = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _core.Vector3();
  var distanceToRef = plane.normal.dot(refPoint);
  out.copy(plane.normal).scale(plane.distance - distanceToRef).add(refPoint);
  return out;
}
function worldToCartesian(viewport, point) {
  var out = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _core.Vector3();
  var cartographicPos = viewport.unprojectPosition(point);
  return _geospatial.Ellipsoid.WGS84.cartographicToCartesian(cartographicPos, out);
}
//# sourceMappingURL=frame-state.js.map