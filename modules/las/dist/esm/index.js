import { LASLoader as LASWorkerLoader } from './las-loader';
import { parseLAS } from './lib/parse-las';
export { LASWorkerLoader };
export const LASLoader = {
  ...LASWorkerLoader,
  parse: async (arrayBuffer, options) => parseLAS(arrayBuffer, options),
  parseSync: (arrayBuffer, options) => parseLAS(arrayBuffer, options)
};
//# sourceMappingURL=index.js.map