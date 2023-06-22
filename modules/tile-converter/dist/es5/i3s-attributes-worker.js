"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckI3SAttributesWorker = exports.I3SAttributesWorker = void 0;
exports.transformI3SAttributesOnWorker = transformI3SAttributesOnWorker;
var _workerUtils = require("@loaders.gl/worker-utils");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var I3SAttributesWorker = {
  id: 'i3s-attributes',
  name: 'I3S Attributes Worker',
  module: 'tile-converter',
  version: VERSION,
  options: {
    useCartesianPositions: false
  }
};
exports.I3SAttributesWorker = I3SAttributesWorker;
function transformI3SAttributesOnWorker(attributesData, options) {
  return (0, _workerUtils.processOnWorker)(I3SAttributesWorker, attributesData, options);
}
var _typecheckI3SAttributesWorker = I3SAttributesWorker;
exports._typecheckI3SAttributesWorker = _typecheckI3SAttributesWorker;
//# sourceMappingURL=i3s-attributes-worker.js.map