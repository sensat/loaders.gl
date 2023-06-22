/// <reference types="node" />
import { ParquetColumnChunk, ParquetOptions, ParquetPageData, SchemaDefinition } from '../schema/declare';
import { CursorBuffer } from '../codecs';
import { SchemaElement } from '../parquet-thrift';
/**
 * Decode data pages
 * @param buffer - input data
 * @param column - parquet column
 * @param compression - compression type
 * @returns parquet data page data
 */
export declare function decodeDataPages(buffer: Buffer, options: ParquetOptions): Promise<ParquetColumnChunk>;
/**
 * Decode parquet page based on page type
 * @param cursor
 * @param options
 */
export declare function decodePage(cursor: CursorBuffer, options: ParquetOptions): Promise<ParquetPageData>;
/**
 * Decode parquet schema
 * @param schemaElements input schema elements data
 * @param offset offset to read from
 * @param len length of data
 * @returns result.offset
 *   result.next - offset at the end of function
 *   result.schema - schema read from the input data
 * @todo output offset is the same as input - possibly excess output field
 */
export declare function decodeSchema(schemaElements: SchemaElement[], offset: number, len: number): {
    offset: number;
    next: number;
    schema: SchemaDefinition;
};
//# sourceMappingURL=decoders.d.ts.map