import * as thrift from 'thrift';
import * as MicroSeconds from './MicroSeconds';
import * as MilliSeconds from './MilliSeconds';
export interface ITimeUnitArgs {
    MILLIS?: MilliSeconds.MilliSeconds;
    MICROS?: MicroSeconds.MicroSeconds;
}
export declare class TimeUnit {
    MILLIS?: MilliSeconds.MilliSeconds;
    MICROS?: MicroSeconds.MicroSeconds;
    constructor(args?: ITimeUnitArgs);
    static fromMILLIS(MILLIS: MilliSeconds.MilliSeconds): TimeUnit;
    static fromMICROS(MICROS: MicroSeconds.MicroSeconds): TimeUnit;
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): TimeUnit;
}
//# sourceMappingURL=TimeUnit.d.ts.map