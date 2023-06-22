/// <reference types="node" />
import Int64 from 'node-int64';
import * as thrift from 'thrift';
export interface IStatisticsArgs {
    max?: Buffer;
    min?: Buffer;
    null_count?: number | Int64;
    distinct_count?: number | Int64;
    max_value?: Buffer;
    min_value?: Buffer;
}
export declare class Statistics {
    max?: Buffer;
    min?: Buffer;
    null_count?: Int64;
    distinct_count?: Int64;
    max_value?: Buffer;
    min_value?: Buffer;
    constructor(args?: IStatisticsArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): Statistics;
}
//# sourceMappingURL=Statistics.d.ts.map