import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
export type ParquetLoaderOptions = LoaderOptions & {
    parquet?: {
        type?: 'arrow-table';
        wasmUrl?: string;
    };
};
/** ParquetJS table loader */
export declare const ParquetWasmLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    worker: boolean;
    category: string;
    extensions: string[];
    mimeTypes: string[];
    binary: boolean;
    tests: string[];
    options: ParquetLoaderOptions;
};
export declare const _typecheckParquetLoader: Loader;
//# sourceMappingURL=parquet-wasm-loader.d.ts.map