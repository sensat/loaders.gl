import * as thrift from 'thrift';
export interface IJsonTypeArgs {
}
export declare class JsonType {
    constructor();
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): JsonType;
}
//# sourceMappingURL=JsonType.d.ts.map