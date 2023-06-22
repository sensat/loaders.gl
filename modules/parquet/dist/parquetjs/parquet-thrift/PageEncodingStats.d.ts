import * as thrift from 'thrift';
import * as Encoding from './Encoding';
import * as PageType from './PageType';
export interface IPageEncodingStatsArgs {
    page_type: PageType.PageType;
    encoding: Encoding.Encoding;
    count: number;
}
export declare class PageEncodingStats {
    page_type: PageType.PageType;
    encoding: Encoding.Encoding;
    count: number;
    constructor(args: IPageEncodingStatsArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): PageEncodingStats;
}
//# sourceMappingURL=PageEncodingStats.d.ts.map