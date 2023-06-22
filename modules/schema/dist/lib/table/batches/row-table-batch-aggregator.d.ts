import type { Schema } from '../../../types/schema';
import type { TableBatch } from '../../../types/category-table';
import { TableBatchAggregator, TableBatchOptions } from './table-batch-aggregator';
export declare class RowTableBatchAggregator implements TableBatchAggregator {
    schema: Schema;
    options: TableBatchOptions;
    length: number;
    objectRows: {
        [columnName: string]: any;
    } | null;
    arrayRows: any[] | null;
    cursor: number;
    private _headers;
    constructor(schema: Schema, options: TableBatchOptions);
    rowCount(): number;
    addArrayRow(row: any[], cursor?: number): void;
    addObjectRow(row: {
        [columnName: string]: any;
    }, cursor?: number): void;
    getBatch(): TableBatch | null;
}
//# sourceMappingURL=row-table-batch-aggregator.d.ts.map