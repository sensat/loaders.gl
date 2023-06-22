import { processOnWorker } from '@loaders.gl/worker-utils';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const Tile3dAttributesWorker = {
  id: '3d-tiles-attributes',
  name: '3DTiles Attributes Worker',
  module: 'tile-converter',
  version: VERSION,
  options: {
    featureAttributes: null
  }
};
export function transform3DTilesAttributesOnWorker(i3sAttributesData, options) {
  return processOnWorker(Tile3dAttributesWorker, i3sAttributesData, options);
}
export const _typecheckI3SAttributesWorker = Tile3dAttributesWorker;
//# sourceMappingURL=3d-tiles-attributes-worker.js.map