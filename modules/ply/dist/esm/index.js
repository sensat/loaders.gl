import { PLYLoader as PLYWorkerLoader } from './ply-loader';
import { parsePLY } from './lib/parse-ply';
import { parsePLYInBatches } from './lib/parse-ply-in-batches';
export { PLYWorkerLoader };
export const PLYLoader = {
  ...PLYWorkerLoader,
  parse: async (arrayBuffer, options) => parsePLY(arrayBuffer, options === null || options === void 0 ? void 0 : options.ply),
  parseTextSync: (arrayBuffer, options) => parsePLY(arrayBuffer, options === null || options === void 0 ? void 0 : options.ply),
  parseSync: (arrayBuffer, options) => parsePLY(arrayBuffer, options === null || options === void 0 ? void 0 : options.ply),
  parseInBatches: (arrayBuffer, options) => parsePLYInBatches(arrayBuffer, options === null || options === void 0 ? void 0 : options.ply)
};
//# sourceMappingURL=index.js.map