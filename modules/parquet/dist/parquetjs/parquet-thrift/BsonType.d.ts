import * as thrift from 'thrift';
export interface IBsonTypeArgs {
}
export declare class BsonType {
    constructor();
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): BsonType;
}
//# sourceMappingURL=BsonType.d.ts.map