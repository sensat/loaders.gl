"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertTextureAtlas = convertTextureAtlas;
function convertTextureAtlas(texCoords, uvRegions) {
  var convertedTexCoords = new Float32Array(texCoords.length);
  var normalisedRegions = normalizeRegions(uvRegions);
  for (var index = 0; index < texCoords.length; index += 2) {
    var uv = texCoords.subarray(index, index + 2);
    var regions = normalisedRegions.slice(index * 2, index * 2 + 4);
    var fractatedUV = fract([uv[0], uv[1]]);
    var subtracted = [regions[2] - regions[0], regions[3] - regions[1]];
    var multiplicationResult = [fractatedUV[0] * subtracted[0], fractatedUV[1] * subtracted[1]];
    var convertedUV = [multiplicationResult[0] + regions[0], multiplicationResult[1] + regions[1]];
    convertedTexCoords[index] = convertedUV[0];
    convertedTexCoords[index + 1] = convertedUV[1];
  }
  return convertedTexCoords;
}
function fract(uv) {
  return [uv[0] - Math.floor(uv[0]), uv[1] - Math.floor(uv[1])];
}
function normalizeRegions(regions) {
  var MAX_UINT_16_VALUE = 65535;
  var normalizedRegions = [];
  for (var index = 0; index < regions.length; index++) {
    normalizedRegions[index] = regions[index] / MAX_UINT_16_VALUE;
  }
  return normalizedRegions;
}
//# sourceMappingURL=texture-atlas.js.map