import type { Table } from 'apache-arrow';
import type { WriterOptions } from '@loaders.gl/loader-utils';
export type ParquetWriterOptions = WriterOptions & {
    parquet?: {
        wasmUrl?: string;
    };
};
/**
 * Encode Arrow Table to Parquet buffer
 */
export declare function encode(table: Table, options?: ParquetWriterOptions): Promise<ArrayBuffer>;
/**
 * Serialize a {@link Table} to the IPC format. This function is a convenience
 * wrapper for {@link RecordBatchStreamWriter} and {@link RecordBatchFileWriter}.
 * Opposite of {@link tableFromIPC}.
 *
 * @param table The Table to serialize.
 * @param type Whether to serialize the Table as a file or a stream.
 */
export declare function tableToIPC(table: Table): Uint8Array;
//# sourceMappingURL=encode-parquet-wasm.d.ts.map