export const generateSyntheticIndices = vertexCount => {
  const result = new Uint32Array(vertexCount);
  for (let index = 0; index < vertexCount; index++) {
    result[index] = index;
  }
  return result;
};
//# sourceMappingURL=geometry-utils.js.map