import type { DataType, Field, Schema, SchemaMetadata } from '../../../types/schema';
import { Field as ArrowField, Schema as ArrowSchema, DataType as ArrowDataType } from 'apache-arrow/Arrow.dom';
export declare function serializeArrowSchema(arrowSchema: ArrowSchema): Schema;
export declare function deserializeArrowSchema(schema: Schema): ArrowSchema;
export declare function serializeArrowMetadata(arrowMetadata: Map<string, string>): SchemaMetadata;
export declare function deserializeArrowMetadata(metadata?: SchemaMetadata): Map<string, string>;
export declare function serializeArrowField(field: ArrowField): Field;
export declare function deserializeArrowField(field: Field): ArrowField;
/** Converts a serializable loaders.gl data type to hydrated arrow data type */
export declare function serializeArrowType(arrowType: ArrowDataType): DataType;
/** Converts a serializable loaders.gl data type to hydrated arrow data type */
export declare function deserializeArrowType(dataType: DataType): ArrowDataType;
//# sourceMappingURL=convert-schema-arrow.d.ts.map