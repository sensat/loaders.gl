import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as ColumnMetaData from './ColumnMetaData';
export interface IColumnChunkArgs {
    file_path?: string;
    file_offset: number | Int64;
    meta_data?: ColumnMetaData.ColumnMetaData;
    offset_index_offset?: number | Int64;
    offset_index_length?: number;
    column_index_offset?: number | Int64;
    column_index_length?: number;
}
export declare class ColumnChunk {
    file_path?: string;
    file_offset: Int64;
    meta_data?: ColumnMetaData.ColumnMetaData;
    offset_index_offset?: Int64;
    offset_index_length?: number;
    column_index_offset?: Int64;
    column_index_length?: number;
    constructor(args: IColumnChunkArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): ColumnChunk;
}
//# sourceMappingURL=ColumnChunk.d.ts.map