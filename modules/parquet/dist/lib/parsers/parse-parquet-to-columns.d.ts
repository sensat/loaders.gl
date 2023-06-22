import { ColumnarTable, ColumnarTableBatch } from '@loaders.gl/schema';
import type { ParquetLoaderOptions } from '../../parquet-loader';
export declare function parseParquetInColumns(arrayBuffer: ArrayBuffer, options?: ParquetLoaderOptions): Promise<ColumnarTable>;
export declare function parseParquetFileInColumnarBatches(blob: Blob, options?: ParquetLoaderOptions): AsyncIterable<ColumnarTableBatch>;
//# sourceMappingURL=parse-parquet-to-columns.d.ts.map