import parsePCDSync from './lib/parse-pcd';
import { PCDLoader as PCDWorkerLoader } from './pcd-loader';
export { PCDWorkerLoader };
export const PCDLoader = {
  ...PCDWorkerLoader,
  parse: async arrayBuffer => parsePCDSync(arrayBuffer),
  parseSync: parsePCDSync
};
export const _typecheckPCDLoader = PCDLoader;
//# sourceMappingURL=index.js.map