import * as thrift from 'thrift';
import * as TimeUnit from './TimeUnit';
export interface ITimestampTypeArgs {
    isAdjustedToUTC: boolean;
    unit: TimeUnit.TimeUnit;
}
export declare class TimestampType {
    isAdjustedToUTC: boolean;
    unit: TimeUnit.TimeUnit;
    constructor(args: ITimestampTypeArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): TimestampType;
}
//# sourceMappingURL=TimestampType.d.ts.map