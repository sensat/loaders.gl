import { processOnWorker } from '@loaders.gl/worker-utils';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const CompressionWorker = {
  id: 'compression',
  name: 'compression',
  module: 'compression',
  version: VERSION,
  options: {}
};
export function compressOnWorker(data, options) {
  return processOnWorker(CompressionWorker, data, options);
}
export const _typecheckCompressionWorker = CompressionWorker;
//# sourceMappingURL=compression-worker.js.map