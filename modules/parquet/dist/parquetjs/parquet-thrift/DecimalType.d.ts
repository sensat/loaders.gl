import * as thrift from 'thrift';
export interface IDecimalTypeArgs {
    scale: number;
    precision: number;
}
export declare class DecimalType {
    scale: number;
    precision: number;
    constructor(args: IDecimalTypeArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): DecimalType;
}
//# sourceMappingURL=DecimalType.d.ts.map