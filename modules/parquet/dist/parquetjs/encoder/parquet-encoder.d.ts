/// <reference types="node" />
/// <reference types="node" />
import { stream } from '@loaders.gl/loader-utils';
import { ParquetRowGroup, ParquetRow } from '../schema/declare';
import { ParquetSchema } from '../schema/schema';
import { RowGroup } from '../parquet-thrift';
export interface ParquetEncoderOptions {
    baseOffset?: number;
    rowGroupSize?: number;
    pageSize?: number;
    useDataPageV2?: boolean;
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    start?: number;
}
/**
 * Write a parquet file to an output stream. The ParquetEncoder will perform
 * buffering/batching for performance, so close() must be called after all rows
 * are written.
 */
export declare class ParquetEncoder<T> {
    /**
     * Convenience method to create a new buffered parquet writer that writes to
     * the specified file
     */
    static openFile<T>(schema: ParquetSchema, path: string, opts?: ParquetEncoderOptions): Promise<ParquetEncoder<T>>;
    /**
     * Convenience method to create a new buffered parquet writer that writes to
     * the specified stream
     */
    static openStream<T>(schema: ParquetSchema, outputStream: stream.Writable, opts?: ParquetEncoderOptions): Promise<ParquetEncoder<T>>;
    schema: ParquetSchema;
    envelopeWriter: ParquetEnvelopeWriter;
    rowBuffer: ParquetRowGroup;
    rowGroupSize: number;
    closed: boolean;
    userMetadata: Record<string, string>;
    /**
     * Create a new buffered parquet writer for a given envelope writer
     */
    constructor(schema: ParquetSchema, envelopeWriter: ParquetEnvelopeWriter, opts: ParquetEncoderOptions);
    writeHeader(): Promise<void>;
    /**
     * Append a single row to the parquet file. Rows are buffered in memory until
     * rowGroupSize rows are in the buffer or close() is called
     */
    appendRow<T extends ParquetRow>(row: T): Promise<void>;
    /**
     * Finish writing the parquet file and commit the footer to disk. This method
     * MUST be called after you are finished adding rows. You must not call this
     * method twice on the same object or add any rows after the close() method has
     * been called
     */
    close(callback?: () => void): Promise<void>;
    /**
     * Add key<>value metadata to the file
     */
    setMetadata(key: string, value: string): void;
    /**
     * Set the parquet row group size. This values controls the maximum number
     * of rows that are buffered in memory at any given time as well as the number
     * of rows that are co-located on disk. A higher value is generally better for
     * read-time I/O performance at the tradeoff of write-time memory usage.
     */
    setRowGroupSize(cnt: number): void;
    /**
     * Set the parquet data page size. The data page size controls the maximum
     * number of column values that are written to disk as a consecutive array
     */
    setPageSize(cnt: number): void;
}
/**
 * Create a parquet file from a schema and a number of row groups. This class
 * performs direct, unbuffered writes to the underlying output stream and is
 * intendend for advanced and internal users; the writeXXX methods must be
 * called in the correct order to produce a valid file.
 */
export declare class ParquetEnvelopeWriter {
    /**
     * Create a new parquet envelope writer that writes to the specified stream
     */
    static openStream(schema: ParquetSchema, outputStream: stream.Writable, opts: ParquetEncoderOptions): Promise<ParquetEnvelopeWriter>;
    schema: ParquetSchema;
    write: (buf: Buffer) => Promise<void>;
    close: () => Promise<void>;
    offset: number;
    rowCount: number;
    rowGroups: RowGroup[];
    pageSize: number;
    useDataPageV2: boolean;
    constructor(schema: ParquetSchema, writeFn: (buf: Buffer) => Promise<void>, closeFn: () => Promise<void>, fileOffset: number, opts: ParquetEncoderOptions);
    writeSection(buf: Buffer): Promise<void>;
    /**
     * Encode the parquet file header
     */
    writeHeader(): Promise<void>;
    /**
     * Encode a parquet row group. The records object should be created using the
     * shredRecord method
     */
    writeRowGroup(records: ParquetRowGroup): Promise<void>;
    /**
     * Write the parquet file footer
     */
    writeFooter(userMetadata: Record<string, string>): Promise<void>;
    /**
     * Set the parquet data page size. The data page size controls the maximum
     * number of column values that are written to disk as a consecutive array
     */
    setPageSize(cnt: number): void;
}
//# sourceMappingURL=parquet-encoder.d.ts.map