import type { ReadableFile } from '@loaders.gl/loader-utils';
import { ParquetSchema } from '../schema/schema';
import { ColumnChunk, FileMetaData, RowGroup } from '../parquet-thrift';
import { ParquetRowGroup, ParquetColumnChunk, ParquetOptions } from '../schema/declare';
export type ParquetReaderProps = {
    defaultDictionarySize?: number;
};
/** Properties for initializing a ParquetRowGroupReader */
export type ParquetIterationProps = {
    /** Filter allowing some columns to be dropped */
    columnList?: string[] | string[][];
};
/**
 * The parquet envelope reader allows direct, unbuffered access to the individual
 * sections of the parquet file, namely the header, footer and the row groups.
 * This class is intended for advanced/internal users; if you just want to retrieve
 * rows from a parquet file use the ParquetReader instead
 */
export declare class ParquetReader {
    props: Required<ParquetReaderProps>;
    file: ReadableFile;
    metadata: Promise<FileMetaData> | null;
    constructor(file: ReadableFile, props?: ParquetReaderProps);
    close(): void;
    /** Yield one row at a time */
    rowIterator(props?: ParquetIterationProps): AsyncGenerator<import("../schema/declare").ParquetRow, void, unknown>;
    /** Yield one batch of rows at a time */
    rowBatchIterator(props?: ParquetIterationProps): AsyncGenerator<import("../schema/declare").ParquetRow[], void, unknown>;
    /** Iterate over the raw row groups */
    rowGroupIterator(props?: ParquetIterationProps): AsyncGenerator<ParquetRowGroup, void, unknown>;
    getRowCount(): Promise<number>;
    getSchema(): Promise<ParquetSchema>;
    /**
     * Returns the user (key/value) metadata for this file
     * In parquet this is not stored on the schema like it is in arrow
     */
    getSchemaMetadata(): Promise<Record<string, string>>;
    getFileMetadata(): Promise<FileMetaData>;
    /** Metadata is stored in the footer */
    readHeader(): Promise<void>;
    /** Metadata is stored in the footer */
    readFooter(): Promise<FileMetaData>;
    /** Data is stored in row groups (similar to Apache Arrow record batches) */
    readRowGroup(schema: ParquetSchema, rowGroup: RowGroup, columnList: string[][]): Promise<ParquetRowGroup>;
    /**
     * Each row group contains column chunks for all the columns.
     */
    readColumnChunk(schema: ParquetSchema, colChunk: ColumnChunk): Promise<ParquetColumnChunk>;
    /**
     * Getting dictionary for allows to flatten values by indices.
     * @param dictionaryPageOffset
     * @param options
     * @param pagesOffset
     * @returns
     */
    getDictionary(dictionaryPageOffset: number, options: ParquetOptions, pagesOffset: number): Promise<string[]>;
}
//# sourceMappingURL=parquet-reader.d.ts.map