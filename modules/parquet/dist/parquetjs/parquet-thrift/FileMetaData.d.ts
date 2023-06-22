import Int64 from 'node-int64';
import * as thrift from 'thrift';
import * as ColumnOrder from './ColumnOrder';
import * as KeyValue from './KeyValue';
import * as RowGroup from './RowGroup';
import * as SchemaElement from './SchemaElement';
export interface IFileMetaDataArgs {
    version: number;
    schema: Array<SchemaElement.SchemaElement>;
    num_rows: number | Int64;
    row_groups: Array<RowGroup.RowGroup>;
    key_value_metadata?: Array<KeyValue.KeyValue>;
    created_by?: string;
    column_orders?: Array<ColumnOrder.ColumnOrder>;
}
export declare class FileMetaData {
    version: number;
    schema: Array<SchemaElement.SchemaElement>;
    num_rows: Int64;
    row_groups: Array<RowGroup.RowGroup>;
    key_value_metadata?: Array<KeyValue.KeyValue>;
    created_by?: string;
    column_orders?: Array<ColumnOrder.ColumnOrder>;
    constructor(args?: IFileMetaDataArgs | null);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): FileMetaData;
}
//# sourceMappingURL=FileMetaData.d.ts.map