import * as thrift from 'thrift';
import * as Encoding from './Encoding';
import * as Statistics from './Statistics';
export interface IDataPageHeaderArgs {
    num_values: number;
    encoding: Encoding.Encoding;
    definition_level_encoding: Encoding.Encoding;
    repetition_level_encoding: Encoding.Encoding;
    statistics?: Statistics.Statistics;
}
export declare class DataPageHeader {
    num_values: number;
    encoding: Encoding.Encoding;
    definition_level_encoding: Encoding.Encoding;
    repetition_level_encoding: Encoding.Encoding;
    statistics?: Statistics.Statistics;
    constructor(args: IDataPageHeaderArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): DataPageHeader;
}
//# sourceMappingURL=DataPageHeader.d.ts.map