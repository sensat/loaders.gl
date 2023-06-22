import { encode } from './lib/wasm/encode-parquet-wasm';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const DEFAULT_PARQUET_WRITER_OPTIONS = {
  parquet: {
    wasmUrl: 'https://unpkg.com/parquet-wasm@0.3.1/esm2/arrow1_bg.wasm'
  }
};
export const ParquetWasmWriter = {
  name: 'Apache Parquet',
  id: 'parquet-wasm',
  module: 'parquet',
  version: VERSION,
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  encode,
  binary: true,
  options: DEFAULT_PARQUET_WRITER_OPTIONS
};
//# sourceMappingURL=parquet-wasm-writer.js.map