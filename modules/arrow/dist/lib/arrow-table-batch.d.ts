import type { ArrowTableBatch } from '@loaders.gl/schema';
import { Schema } from 'apache-arrow';
import { ColumnarTableBatchAggregator } from '@loaders.gl/schema';
export default class ArrowTableBatchAggregator extends ColumnarTableBatchAggregator {
    arrowSchema: Schema | null;
    constructor(schema: any, options: any);
    getBatch(): ArrowTableBatch | null;
}
//# sourceMappingURL=arrow-table-batch.d.ts.map