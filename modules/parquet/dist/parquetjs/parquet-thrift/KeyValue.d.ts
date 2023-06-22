import * as thrift from 'thrift';
export interface IKeyValueArgs {
    key: string;
    value?: string;
}
export declare class KeyValue {
    key: string;
    value?: string;
    constructor(args: IKeyValueArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): KeyValue;
}
//# sourceMappingURL=KeyValue.d.ts.map