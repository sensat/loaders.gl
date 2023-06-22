import type { LoaderWithParser } from '@loaders.gl/loader-utils';
import type { ObjectRowTable, ObjectRowTableBatch, ColumnarTable, ColumnarTableBatch } from '@loaders.gl/schema';
import type { Table as ArrowTable } from 'apache-arrow';
import { ParquetLoader as ParquetWorkerLoader, ParquetLoaderOptions } from './parquet-loader';
import { ParquetWasmLoaderOptions } from './lib/wasm/parse-parquet-wasm';
import { ParquetWasmLoader as ParquetWasmWorkerLoader } from './parquet-wasm-loader';
export { ParquetWorkerLoader, ParquetWasmWorkerLoader };
/** ParquetJS table loader */
export declare const ParquetLoader: LoaderWithParser<ObjectRowTable, ObjectRowTableBatch, ParquetLoaderOptions>;
/** ParquetJS table loader */
export declare const ParquetColumnarLoader: LoaderWithParser<ColumnarTable, ColumnarTableBatch, ParquetLoaderOptions>;
export declare const ParquetWasmLoader: LoaderWithParser<ArrowTable, never, ParquetWasmLoaderOptions>;
export { ParquetWriter as _ParquetWriter } from './parquet-writer';
export { ParquetWasmWriter } from './parquet-wasm-writer';
export { preloadCompressions } from './parquetjs/compression';
export { ParquetSchema } from './parquetjs/schema/schema';
export { ParquetReader } from './parquetjs/parser/parquet-reader';
export { ParquetEncoder } from './parquetjs/encoder/parquet-encoder';
export { convertParquetSchema, convertParquetSchema as convertParquetToArrowSchema } from './lib/arrow/convert-schema-from-parquet';
export declare const _typecheckParquetLoader: LoaderWithParser;
export { default as geoJSONSchema } from './lib/geo/geoparquet-schema';
export type { GeoMetadata } from './lib/geo/decode-geo-metadata';
export { getGeoMetadata, setGeoMetadata, unpackGeoMetadata } from './lib/geo/decode-geo-metadata';
//# sourceMappingURL=index.d.ts.map