import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as ColumnChunk from './ColumnChunk';
import * as SortingColumn from './SortingColumn';
export interface IRowGroupArgs {
    columns: Array<ColumnChunk.ColumnChunk>;
    total_byte_size: number | Int64;
    num_rows: number | Int64;
    sorting_columns?: Array<SortingColumn.SortingColumn>;
}
export declare class RowGroup {
    columns: Array<ColumnChunk.ColumnChunk>;
    total_byte_size: Int64;
    num_rows: Int64;
    sorting_columns?: Array<SortingColumn.SortingColumn>;
    constructor(args: IRowGroupArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): RowGroup;
}
//# sourceMappingURL=RowGroup.d.ts.map