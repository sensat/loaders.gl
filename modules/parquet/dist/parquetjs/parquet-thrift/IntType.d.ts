import * as thrift from 'thrift';
export interface IIntTypeArgs {
    bitWidth: number;
    isSigned: boolean;
}
export declare class IntType {
    bitWidth: number;
    isSigned: boolean;
    constructor(args: IIntTypeArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): IntType;
}
//# sourceMappingURL=IntType.d.ts.map