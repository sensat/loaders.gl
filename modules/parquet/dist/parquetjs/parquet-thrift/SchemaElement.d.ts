import * as thrift from 'thrift';
import * as ConvertedType from './ConvertedType';
import * as FieldRepetitionType from './FieldRepetitionType';
import * as LogicalType from './LogicalType';
import * as Type from './Type';
export interface ISchemaElementArgs {
    type?: Type.Type;
    type_length?: number;
    repetition_type?: FieldRepetitionType.FieldRepetitionType;
    name: string;
    num_children?: number;
    converted_type?: ConvertedType.ConvertedType;
    scale?: number;
    precision?: number;
    field_id?: number;
    logicalType?: LogicalType.LogicalType;
}
export declare class SchemaElement {
    type?: Type.Type;
    type_length?: number;
    repetition_type?: FieldRepetitionType.FieldRepetitionType;
    name: string;
    num_children?: number;
    converted_type?: ConvertedType.ConvertedType;
    scale?: number;
    precision?: number;
    field_id?: number;
    logicalType?: LogicalType.LogicalType;
    constructor(args: ISchemaElementArgs);
    write(output: thrift.TProtocol): void;
    static read(input: thrift.TProtocol): SchemaElement;
}
//# sourceMappingURL=SchemaElement.d.ts.map