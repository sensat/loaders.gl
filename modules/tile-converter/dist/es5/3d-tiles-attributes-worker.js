"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckI3SAttributesWorker = exports.Tile3dAttributesWorker = void 0;
exports.transform3DTilesAttributesOnWorker = transform3DTilesAttributesOnWorker;
var _workerUtils = require("@loaders.gl/worker-utils");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var Tile3dAttributesWorker = {
  id: '3d-tiles-attributes',
  name: '3DTiles Attributes Worker',
  module: 'tile-converter',
  version: VERSION,
  options: {
    featureAttributes: null
  }
};
exports.Tile3dAttributesWorker = Tile3dAttributesWorker;
function transform3DTilesAttributesOnWorker(i3sAttributesData, options) {
  return (0, _workerUtils.processOnWorker)(Tile3dAttributesWorker, i3sAttributesData, options);
}
var _typecheckI3SAttributesWorker = Tile3dAttributesWorker;
exports._typecheckI3SAttributesWorker = _typecheckI3SAttributesWorker;
//# sourceMappingURL=3d-tiles-attributes-worker.js.map