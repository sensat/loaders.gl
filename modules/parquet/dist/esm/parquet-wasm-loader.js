const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const DEFAULT_PARQUET_LOADER_OPTIONS = {
  parquet: {
    type: 'arrow-table',
    wasmUrl: 'https://unpkg.com/parquet-wasm@0.3.1/esm2/arrow1_bg.wasm'
  }
};
export const ParquetWasmLoader = {
  name: 'Apache Parquet',
  id: 'parquet-wasm',
  module: 'parquet',
  version: VERSION,
  worker: false,
  category: 'table',
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  binary: true,
  tests: ['PAR1', 'PARE'],
  options: DEFAULT_PARQUET_LOADER_OPTIONS
};
export const _typecheckParquetLoader = ParquetWasmLoader;
//# sourceMappingURL=parquet-wasm-loader.js.map