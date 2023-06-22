import { OriginalType, ParquetField, ParquetType, PrimitiveType } from './declare';
export interface ParquetTypeKit {
    primitiveType: PrimitiveType;
    originalType?: OriginalType;
    typeLength?: number;
    toPrimitive: Function;
    fromPrimitive?: Function;
}
export declare const PARQUET_LOGICAL_TYPES: Record<ParquetType, ParquetTypeKit>;
/**
 * Convert a value from it's native representation to the internal/underlying
 * primitive type
 */
export declare function toPrimitive(type: ParquetType, value: unknown, field?: ParquetField): unknown;
/**
 * Convert a value from it's internal/underlying primitive representation to
 * the native representation
 */
export declare function fromPrimitive(type: ParquetType, value: unknown, field?: ParquetField): any;
//# sourceMappingURL=types.d.ts.map