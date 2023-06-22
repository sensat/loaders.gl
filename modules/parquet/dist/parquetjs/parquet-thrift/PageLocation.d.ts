import Int64 from 'node-int64';
import * as thrift from 'thrift';
export interface IPageLocationArgs {
    offset: number | Int64;
    compressed_page_size: number;
    first_row_index: number | Int64;
}
export declare class PageLocation {
    offset: Int64;
    compressed_page_size: number;
    first_row_index: Int64;
    constructor(args: IPageLocationArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): PageLocation;
}
//# sourceMappingURL=PageLocation.d.ts.map