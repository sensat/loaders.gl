import { ParquetLoader as ParquetWorkerLoader, ParquetLoader as ParquetColumnarWorkerLoader } from './parquet-loader';
import { parseParquet, parseParquetFileInBatches } from './lib/parsers/parse-parquet-to-rows';
import { parseParquetInColumns, parseParquetFileInColumnarBatches } from './lib/parsers/parse-parquet-to-columns';
import { parseParquetWasm } from './lib/wasm/parse-parquet-wasm';
import { ParquetWasmLoader as ParquetWasmWorkerLoader } from './parquet-wasm-loader';
export { ParquetWorkerLoader, ParquetWasmWorkerLoader };
export const ParquetLoader = {
  ...ParquetWorkerLoader,
  parse: parseParquet,
  parseFileInBatches: parseParquetFileInBatches
};
export const ParquetColumnarLoader = {
  ...ParquetColumnarWorkerLoader,
  parse: parseParquetInColumns,
  parseFileInBatches: parseParquetFileInColumnarBatches
};
export const ParquetWasmLoader = {
  ...ParquetWasmWorkerLoader,
  parse: parseParquetWasm
};
export { ParquetWriter as _ParquetWriter } from './parquet-writer';
export { ParquetWasmWriter } from './parquet-wasm-writer';
export { preloadCompressions } from './parquetjs/compression';
export { ParquetSchema } from './parquetjs/schema/schema';
export { ParquetReader } from './parquetjs/parser/parquet-reader';
export { ParquetEncoder } from './parquetjs/encoder/parquet-encoder';
export { convertParquetSchema, convertParquetSchema as convertParquetToArrowSchema } from './lib/arrow/convert-schema-from-parquet';
export const _typecheckParquetLoader = ParquetLoader;
export { default as geoJSONSchema } from './lib/geo/geoparquet-schema';
export { getGeoMetadata, setGeoMetadata, unpackGeoMetadata } from './lib/geo/decode-geo-metadata';
//# sourceMappingURL=index.js.map