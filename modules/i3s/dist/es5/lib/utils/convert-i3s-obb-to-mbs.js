"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertI3SObbToMbs = convertI3SObbToMbs;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _culling = require("@math.gl/culling");
var _geospatial = require("@math.gl/geospatial");
function convertI3SObbToMbs(obb) {
  var halfSize = obb.halfSize;
  var centerCartesian = _geospatial.Ellipsoid.WGS84.cartographicToCartesian(obb.center);
  var sphere = new _culling.BoundingSphere().fromCornerPoints([centerCartesian[0] - halfSize[0], centerCartesian[1] - halfSize[1], centerCartesian[2] - halfSize[2]], [centerCartesian[0] + halfSize[0], centerCartesian[1] + halfSize[1], centerCartesian[2] + halfSize[2]]);
  return [].concat((0, _toConsumableArray2.default)(obb.center), [sphere.radius]);
}
//# sourceMappingURL=convert-i3s-obb-to-mbs.js.map