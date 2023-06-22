import * as thrift from 'thrift';
export interface ISortingColumnArgs {
    column_idx: number;
    descending: boolean;
    nulls_first: boolean;
}
export declare class SortingColumn {
    column_idx: number;
    descending: boolean;
    nulls_first: boolean;
    constructor(args: ISortingColumnArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): SortingColumn;
}
//# sourceMappingURL=SortingColumn.d.ts.map