import type { LoaderOptions } from '@loaders.gl/loader-utils';
import { Table as ArrowTable } from 'apache-arrow';
export type ParquetWasmLoaderOptions = LoaderOptions & {
    parquet?: {
        type?: 'arrow-table';
        wasmUrl?: string;
    };
};
export declare function parseParquetWasm(arrayBuffer: ArrayBuffer, options?: ParquetWasmLoaderOptions): Promise<ArrowTable>;
//# sourceMappingURL=parse-parquet-wasm.d.ts.map