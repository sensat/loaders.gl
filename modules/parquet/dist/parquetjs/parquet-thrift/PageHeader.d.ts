import * as thrift from 'thrift';
import * as DataPageHeader from './DataPageHeader';
import * as DataPageHeaderV2 from './DataPageHeaderV2';
import * as DictionaryPageHeader from './DictionaryPageHeader';
import * as IndexPageHeader from './IndexPageHeader';
import * as PageType from './PageType';
export interface IPageHeaderArgs {
    type: PageType.PageType;
    uncompressed_page_size: number;
    compressed_page_size: number;
    crc?: number;
    data_page_header?: DataPageHeader.DataPageHeader;
    index_page_header?: IndexPageHeader.IndexPageHeader;
    dictionary_page_header?: DictionaryPageHeader.DictionaryPageHeader;
    data_page_header_v2?: DataPageHeaderV2.DataPageHeaderV2;
}
export declare class PageHeader {
    type: PageType.PageType;
    uncompressed_page_size: number;
    compressed_page_size: number;
    crc?: number;
    data_page_header?: DataPageHeader.DataPageHeader;
    index_page_header?: IndexPageHeader.IndexPageHeader;
    dictionary_page_header?: DictionaryPageHeader.DictionaryPageHeader;
    data_page_header_v2?: DataPageHeaderV2.DataPageHeaderV2;
    constructor(args: IPageHeaderArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): PageHeader;
}
//# sourceMappingURL=PageHeader.d.ts.map