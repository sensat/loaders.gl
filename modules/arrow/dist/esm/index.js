import { ArrowLoader as ArrowWorkerLoader } from './arrow-loader';
import parseSync from './lib/parse-arrow-sync';
import { parseArrowInBatches } from './lib/parse-arrow-in-batches';
import { TableBatchBuilder } from '@loaders.gl/schema';
import ArrowTableBatchAggregator from './lib/arrow-table-batch';
TableBatchBuilder.ArrowBatch = ArrowTableBatchAggregator;
export { VECTOR_TYPES } from './types';
export { ArrowWriter } from './arrow-writer';
export { ArrowWorkerLoader };
export const ArrowLoader = {
  ...ArrowWorkerLoader,
  parse: async (arraybuffer, options) => parseSync(arraybuffer, options),
  parseSync,
  parseInBatches: parseArrowInBatches
};
export const _typecheckArrowLoader = ArrowLoader;
//# sourceMappingURL=index.js.map