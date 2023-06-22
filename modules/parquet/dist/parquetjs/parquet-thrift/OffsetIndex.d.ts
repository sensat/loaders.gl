import * as thrift from 'thrift';
import * as PageLocation from './PageLocation';
export interface IOffsetIndexArgs {
    page_locations: Array<PageLocation.PageLocation>;
}
export declare class OffsetIndex {
    page_locations: Array<PageLocation.PageLocation>;
    constructor(args: IOffsetIndexArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): OffsetIndex;
}
//# sourceMappingURL=OffsetIndex.d.ts.map