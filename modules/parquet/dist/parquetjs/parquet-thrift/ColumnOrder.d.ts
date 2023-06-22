import * as thrift from 'thrift';
import * as TypeDefinedOrder from './TypeDefinedOrder';
export interface IColumnOrderArgs {
    TYPE_ORDER?: TypeDefinedOrder.TypeDefinedOrder;
}
export declare class ColumnOrder {
    TYPE_ORDER?: TypeDefinedOrder.TypeDefinedOrder;
    constructor(args?: IColumnOrderArgs);
    static fromTYPE_ORDER(TYPE_ORDER: TypeDefinedOrder.TypeDefinedOrder): ColumnOrder;
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): ColumnOrder;
}
//# sourceMappingURL=ColumnOrder.d.ts.map