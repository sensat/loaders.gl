"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i3sObbTo3dTilesObb = i3sObbTo3dTilesObb;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _core = require("@math.gl/core");
var _geospatial = require("@math.gl/geospatial");
var _culling = require("@math.gl/culling");
function i3sObbTo3dTilesObb(i3SObb, geoidHeightModel) {
  var tiles3DCenter = [i3SObb.center[0], i3SObb.center[1], i3SObb.center[2] + geoidHeightModel.getHeight(i3SObb.center[1], i3SObb.center[0])];
  var cartesianCenter = _geospatial.Ellipsoid.WGS84.cartographicToCartesian(tiles3DCenter, new _core.Vector3());
  var tiles3DObb = new _culling.OrientedBoundingBox().fromCenterHalfSizeQuaternion(cartesianCenter, i3SObb.halfSize, i3SObb.quaternion);
  return [].concat((0, _toConsumableArray2.default)(tiles3DObb.center), (0, _toConsumableArray2.default)(tiles3DObb.halfAxes.toArray()));
}
//# sourceMappingURL=i3s-obb-to-3d-tiles-obb.js.map