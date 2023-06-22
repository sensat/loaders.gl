import { processOnWorker } from '@loaders.gl/worker-utils';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const I3SAttributesWorker = {
  id: 'i3s-attributes',
  name: 'I3S Attributes Worker',
  module: 'tile-converter',
  version: VERSION,
  options: {
    useCartesianPositions: false
  }
};
export function transformI3SAttributesOnWorker(attributesData, options) {
  return processOnWorker(I3SAttributesWorker, attributesData, options);
}
export const _typecheckI3SAttributesWorker = I3SAttributesWorker;
//# sourceMappingURL=i3s-attributes-worker.js.map