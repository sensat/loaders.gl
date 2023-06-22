const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const DEFAULT_PARQUET_LOADER_OPTIONS = {
  parquet: {
    type: 'object-row-table',
    url: undefined,
    columnList: [],
    geoparquet: true
  }
};
export const ParquetLoader = {
  name: 'Apache Parquet',
  id: 'parquet',
  module: 'parquet',
  version: VERSION,
  worker: true,
  category: 'table',
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  binary: true,
  tests: ['PAR1', 'PARE'],
  options: DEFAULT_PARQUET_LOADER_OPTIONS
};
export const ParqueColumnnartLoader = {
  name: 'Apache Parquet',
  id: 'parquet',
  module: 'parquet',
  version: VERSION,
  worker: true,
  category: 'table',
  extensions: ['parquet'],
  mimeTypes: ['application/octet-stream'],
  binary: true,
  tests: ['PAR1', 'PARE'],
  options: DEFAULT_PARQUET_LOADER_OPTIONS
};
//# sourceMappingURL=parquet-loader.js.map