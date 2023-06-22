import Int64 from 'node-int64';
import type { PageHeader } from '../parquet-thrift';
export type ParquetCodec = 'PLAIN' | 'RLE' | 'PLAIN_DICTIONARY';
export type ParquetCompression = 'UNCOMPRESSED' | 'GZIP' | 'SNAPPY' | 'LZO' | 'BROTLI' | 'LZ4' | 'LZ4_RAW' | 'ZSTD';
export type RepetitionType = 'REQUIRED' | 'OPTIONAL' | 'REPEATED';
export type ParquetType = PrimitiveType | OriginalType;
/**
 * Physical type
 */
export type PrimitiveType = 'BOOLEAN' | 'INT32' | 'INT64' | 'INT96' | 'FLOAT' | 'DOUBLE' | 'BYTE_ARRAY' | 'FIXED_LEN_BYTE_ARRAY';
/**
 * Logical type
 */
export type OriginalType = 'UTF8' | 'DECIMAL_INT32' | 'DECIMAL_INT64' | 'DECIMAL_BYTE_ARRAY' | 'DECIMAL_FIXED_LEN_BYTE_ARRAY' | 'DATE' | 'TIME_MILLIS' | 'TIME_MICROS' | 'TIMESTAMP_MILLIS' | 'TIMESTAMP_MICROS' | 'UINT_8' | 'UINT_16' | 'UINT_32' | 'UINT_64' | 'INT_8' | 'INT_16' | 'INT_32' | 'INT_64' | 'JSON' | 'BSON' | 'INTERVAL';
export type ParquetDictionary = string[];
export interface SchemaDefinition {
    [string: string]: FieldDefinition;
}
export interface FieldDefinition {
    type?: ParquetType;
    typeLength?: number;
    presision?: number;
    scale?: number;
    encoding?: ParquetCodec;
    compression?: ParquetCompression;
    optional?: boolean;
    repeated?: boolean;
    fields?: SchemaDefinition;
}
export interface ParquetField {
    name: string;
    path: string[];
    key: string;
    primitiveType?: PrimitiveType;
    originalType?: OriginalType;
    repetitionType: RepetitionType;
    typeLength?: number;
    presision?: number;
    scale?: number;
    encoding?: ParquetCodec;
    compression?: ParquetCompression;
    rLevelMax: number;
    dLevelMax: number;
    isNested?: boolean;
    fieldCount?: number;
    fields?: Record<string, ParquetField>;
}
/** @todo better name, this is an internal type? */
export interface ParquetOptions {
    type: ParquetType;
    rLevelMax: number;
    dLevelMax: number;
    compression: ParquetCompression;
    column: ParquetField;
    numValues?: Int64;
    dictionary?: ParquetDictionary;
}
export interface ParquetPageData {
    dlevels: number[];
    rlevels: number[];
    /** Actual column chunks */
    values: any[];
    count: number;
    dictionary?: ParquetDictionary;
    /** The "raw" page header from the file */
    pageHeader: PageHeader;
}
export interface ParquetRow {
    [key: string]: any;
}
/** @
 * Holds data for one row group (column chunks) */
export declare class ParquetRowGroup {
    /** Number of rows in this page */
    rowCount: number;
    /** Map of Column chunks */
    columnData: Record<string, ParquetColumnChunk>;
    constructor(rowCount?: number, columnData?: Record<string, ParquetColumnChunk>);
}
/** Holds the data for one column chunk */
export interface ParquetColumnChunk {
    dlevels: number[];
    rlevels: number[];
    values: any[];
    count: number;
    pageHeaders: PageHeader[];
}
//# sourceMappingURL=declare.d.ts.map