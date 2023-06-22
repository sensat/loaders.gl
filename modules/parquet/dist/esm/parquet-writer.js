const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const DEFAULT_PARQUET_LOADER_OPTIONS = {};
export const ParquetWriter = {
  name: 'Apache Parquet',
  id: 'parquet',
  module: 'parquet',
  version: VERSION,
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  encodeSync,
  binary: true,
  options: DEFAULT_PARQUET_LOADER_OPTIONS
};
function encodeSync(data, options) {
  return new ArrayBuffer(0);
}
//# sourceMappingURL=parquet-writer.js.map