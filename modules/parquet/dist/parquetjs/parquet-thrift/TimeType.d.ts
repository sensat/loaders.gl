import * as thrift from 'thrift';
import * as TimeUnit from './TimeUnit';
export interface ITimeTypeArgs {
    isAdjustedToUTC: boolean;
    unit: TimeUnit.TimeUnit;
}
export declare class TimeType {
    isAdjustedToUTC: boolean;
    unit: TimeUnit.TimeUnit;
    constructor(args: ITimeTypeArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): TimeType;
}
//# sourceMappingURL=TimeType.d.ts.map