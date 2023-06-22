import { ObjectRowTable, ObjectRowTableBatch } from '@loaders.gl/schema';
import type { ParquetLoaderOptions } from '../../parquet-loader';
export declare function parseParquet(arrayBuffer: ArrayBuffer, options?: ParquetLoaderOptions): Promise<ObjectRowTable>;
export declare function parseParquetFileInBatches(blob: Blob, options?: ParquetLoaderOptions): AsyncIterable<ObjectRowTableBatch>;
//# sourceMappingURL=parse-parquet-to-rows.d.ts.map