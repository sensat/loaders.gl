import * as thrift from 'thrift';
import * as Encoding from './Encoding';
export interface IDictionaryPageHeaderArgs {
    num_values: number;
    encoding: Encoding.Encoding;
    is_sorted?: boolean;
}
export declare class DictionaryPageHeader {
    num_values: number;
    encoding: Encoding.Encoding;
    is_sorted?: boolean;
    constructor(args: IDictionaryPageHeaderArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): DictionaryPageHeader;
}
//# sourceMappingURL=DictionaryPageHeader.d.ts.map