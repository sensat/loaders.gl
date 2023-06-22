/// <reference types="node" />
import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as BoundaryOrder from './BoundaryOrder';
export interface IColumnIndexArgs {
    null_pages: Array<boolean>;
    min_values: Array<Buffer>;
    max_values: Array<Buffer>;
    boundary_order: BoundaryOrder.BoundaryOrder;
    null_counts?: Array<number | Int64>;
}
export declare class ColumnIndex {
    null_pages: Array<boolean>;
    min_values: Array<Buffer>;
    max_values: Array<Buffer>;
    boundary_order: BoundaryOrder.BoundaryOrder;
    null_counts?: Array<Int64>;
    constructor(args: IColumnIndexArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): ColumnIndex;
}
//# sourceMappingURL=ColumnIndex.d.ts.map