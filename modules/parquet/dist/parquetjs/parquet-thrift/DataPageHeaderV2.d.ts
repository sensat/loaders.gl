import * as thrift from 'thrift';
import * as Encoding from './Encoding';
import * as Statistics from './Statistics';
export interface IDataPageHeaderV2Args {
    num_values: number;
    num_nulls: number;
    num_rows: number;
    encoding: Encoding.Encoding;
    definition_levels_byte_length: number;
    repetition_levels_byte_length: number;
    is_compressed?: boolean;
    statistics?: Statistics.Statistics;
}
export declare class DataPageHeaderV2 {
    num_values: number;
    num_nulls: number;
    num_rows: number;
    encoding: Encoding.Encoding;
    definition_levels_byte_length: number;
    repetition_levels_byte_length: number;
    is_compressed?: boolean;
    statistics?: Statistics.Statistics;
    constructor(args: IDataPageHeaderV2Args);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): DataPageHeaderV2;
}
//# sourceMappingURL=DataPageHeaderV2.d.ts.map