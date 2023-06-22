import { FlatGeobufLoader as FlatGeobufWorkerLoader } from './flatgeobuf-loader';
import { parseFlatGeobuf, parseFlatGeobufInBatches } from './lib/parse-flatgeobuf';
export { FlatGeobufWorkerLoader };
export const FlatGeobufLoader = {
  ...FlatGeobufWorkerLoader,
  parse: async (arrayBuffer, options) => parseFlatGeobuf(arrayBuffer, options),
  parseSync: parseFlatGeobuf,
  parseInBatchesFromStream: parseFlatGeobufInBatches,
  binary: true
};
export const _typecheckFlatGeobufLoader = FlatGeobufLoader;
//# sourceMappingURL=index.js.map