import { parseOBJ } from './lib/parse-obj';
import { OBJLoader as OBJWorkerLoader } from './obj-loader';
import { parseMTL } from './lib/parse-mtl';
import { MTLLoader as MTLWorkerLoader } from './mtl-loader';
export { OBJWorkerLoader };
export const OBJLoader = {
  ...OBJWorkerLoader,
  parse: async (arrayBuffer, options) => parseOBJ(new TextDecoder().decode(arrayBuffer), options),
  parseTextSync: (text, options) => parseOBJ(text, options)
};
export const MTLLoader = {
  ...MTLWorkerLoader,
  parse: async (arrayBuffer, options) => parseMTL(new TextDecoder().decode(arrayBuffer), options === null || options === void 0 ? void 0 : options.mtl),
  parseTextSync: (text, options) => parseMTL(text, options === null || options === void 0 ? void 0 : options.mtl)
};
export const _typecheckOBJLoader = OBJLoader;
export const _typecheckMTLLoader = MTLLoader;
//# sourceMappingURL=index.js.map