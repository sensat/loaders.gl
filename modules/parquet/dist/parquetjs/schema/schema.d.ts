import { FieldDefinition, ParquetRowGroup, ParquetCompression, ParquetField, ParquetRow, SchemaDefinition } from './declare';
/**
 * A parquet file schema
 */
export declare class ParquetSchema {
    schema: Record<string, FieldDefinition>;
    fields: Record<string, ParquetField>;
    fieldList: ParquetField[];
    /**
     * Create a new schema from a JSON schema definition
     */
    constructor(schema: SchemaDefinition);
    /**
     * Retrieve a field definition
     */
    findField(path: string | string[]): ParquetField;
    /**
     * Retrieve a field definition and all the field's ancestors
     */
    findFieldBranch(path: string | string[]): ParquetField[];
    shredRecord(row: ParquetRow, rowGroup: ParquetRowGroup): void;
    materializeRows(rowGroup: ParquetRowGroup): ParquetRow[];
    compress(type: ParquetCompression): this;
    rowGroup(): ParquetRowGroup;
}
//# sourceMappingURL=schema.d.ts.map