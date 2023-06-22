export function convertTextureAtlas(texCoords, uvRegions) {
  const convertedTexCoords = new Float32Array(texCoords.length);
  const normalisedRegions = normalizeRegions(uvRegions);
  for (let index = 0; index < texCoords.length; index += 2) {
    const uv = texCoords.subarray(index, index + 2);
    const regions = normalisedRegions.slice(index * 2, index * 2 + 4);
    const fractatedUV = fract([uv[0], uv[1]]);
    const subtracted = [regions[2] - regions[0], regions[3] - regions[1]];
    const multiplicationResult = [fractatedUV[0] * subtracted[0], fractatedUV[1] * subtracted[1]];
    const convertedUV = [multiplicationResult[0] + regions[0], multiplicationResult[1] + regions[1]];
    convertedTexCoords[index] = convertedUV[0];
    convertedTexCoords[index + 1] = convertedUV[1];
  }
  return convertedTexCoords;
}
function fract(uv) {
  return [uv[0] - Math.floor(uv[0]), uv[1] - Math.floor(uv[1])];
}
function normalizeRegions(regions) {
  const MAX_UINT_16_VALUE = 65535;
  const normalizedRegions = [];
  for (let index = 0; index < regions.length; index++) {
    normalizedRegions[index] = regions[index] / MAX_UINT_16_VALUE;
  }
  return normalizedRegions;
}
//# sourceMappingURL=texture-atlas.js.map