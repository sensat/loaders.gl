"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSyntheticIndices = void 0;
var generateSyntheticIndices = function generateSyntheticIndices(vertexCount) {
  var result = new Uint32Array(vertexCount);
  for (var index = 0; index < vertexCount; index++) {
    result[index] = index;
  }
  return result;
};
exports.generateSyntheticIndices = generateSyntheticIndices;
//# sourceMappingURL=geometry-utils.js.map