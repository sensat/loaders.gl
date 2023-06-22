import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
import type { ObjectRowTable, ObjectRowTableBatch, ColumnarTable, ColumnarTableBatch } from '@loaders.gl/schema';
export type ParquetLoaderOptions = LoaderOptions & {
    parquet?: {
        type?: 'object-row-table';
        url?: string;
        columnList?: string[] | string[][];
        geoparquet?: boolean;
    };
};
/** ParquetJS table loader */
export declare const ParquetLoader: Loader<ObjectRowTable, ObjectRowTableBatch, ParquetLoaderOptions>;
export declare const ParqueColumnnartLoader: Loader<ColumnarTable, ColumnarTableBatch, ParquetLoaderOptions>;
//# sourceMappingURL=parquet-loader.d.ts.map