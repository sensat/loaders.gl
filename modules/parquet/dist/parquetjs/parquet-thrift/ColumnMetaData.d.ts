import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as CompressionCodec from './CompressionCodec';
import * as Encoding from './Encoding';
import * as KeyValue from './KeyValue';
import * as PageEncodingStats from './PageEncodingStats';
import * as Statistics from './Statistics';
import * as Type from './Type';
export interface IColumnMetaDataArgs {
    type: Type.Type;
    encodings: Array<Encoding.Encoding>;
    path_in_schema: Array<string>;
    codec: CompressionCodec.CompressionCodec;
    num_values: number | Int64;
    total_uncompressed_size: number | Int64;
    total_compressed_size: number | Int64;
    key_value_metadata?: Array<KeyValue.KeyValue>;
    data_page_offset: number | Int64;
    index_page_offset?: number | Int64;
    dictionary_page_offset?: number | Int64;
    statistics?: Statistics.Statistics;
    encoding_stats?: Array<PageEncodingStats.PageEncodingStats>;
}
export declare class ColumnMetaData {
    type: Type.Type;
    encodings: Array<Encoding.Encoding>;
    path_in_schema: Array<string>;
    codec: CompressionCodec.CompressionCodec;
    num_values: Int64;
    total_uncompressed_size: Int64;
    total_compressed_size: Int64;
    key_value_metadata?: Array<KeyValue.KeyValue>;
    data_page_offset: Int64;
    index_page_offset?: Int64;
    dictionary_page_offset?: Int64;
    statistics?: Statistics.Statistics;
    encoding_stats?: Array<PageEncodingStats.PageEncodingStats>;
    constructor(args: IColumnMetaDataArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): ColumnMetaData;
}
//# sourceMappingURL=ColumnMetaData.d.ts.map