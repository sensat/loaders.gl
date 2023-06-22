import { parseQuantizedMesh } from './lib/parse-quantized-mesh';
import { makeTerrainMeshFromImage } from './lib/parse-terrain';
import { TerrainLoader as TerrainWorkerLoader } from './terrain-loader';
import { QuantizedMeshLoader as QuantizedMeshWorkerLoader } from './quantized-mesh-loader';
export { TerrainWorkerLoader };
export const TerrainLoader = {
  ...TerrainWorkerLoader,
  parse: parseTerrain
};
export async function parseTerrain(arrayBuffer, options, context) {
  const loadImageOptions = {
    ...options,
    mimeType: 'application/x.image',
    image: {
      ...(options === null || options === void 0 ? void 0 : options.image),
      type: 'data'
    }
  };
  const image = await (context === null || context === void 0 ? void 0 : context.parse(arrayBuffer, loadImageOptions));
  const terrainOptions = {
    ...TerrainLoader.options.terrain,
    ...(options === null || options === void 0 ? void 0 : options.terrain)
  };
  return makeTerrainMeshFromImage(image, terrainOptions);
}
export { QuantizedMeshWorkerLoader };
export const QuantizedMeshLoader = {
  ...QuantizedMeshWorkerLoader,
  parseSync: (arrayBuffer, options) => parseQuantizedMesh(arrayBuffer, options === null || options === void 0 ? void 0 : options['quantized-mesh']),
  parse: async (arrayBuffer, options) => parseQuantizedMesh(arrayBuffer, options === null || options === void 0 ? void 0 : options['quantized-mesh'])
};
//# sourceMappingURL=index.js.map