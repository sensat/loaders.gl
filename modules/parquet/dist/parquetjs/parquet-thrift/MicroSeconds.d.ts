import * as thrift from 'thrift';
export interface IMicroSecondsArgs {
}
export declare class MicroSeconds {
    constructor();
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): MicroSeconds;
}
//# sourceMappingURL=MicroSeconds.d.ts.map