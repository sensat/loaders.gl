const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const ArrowLoader = {
  name: 'Apache Arrow',
  id: 'arrow',
  module: 'arrow',
  version: VERSION,
  category: 'table',
  extensions: ['arrow', 'feather'],
  mimeTypes: ['application/vnd.apache.arrow.file', 'application/vnd.apache.arrow.stream', 'application/octet-stream'],
  binary: true,
  tests: ['ARROW'],
  options: {
    arrow: {
      shape: 'columnar-table'
    }
  }
};
export const _typecheckArrowLoader = ArrowLoader;
//# sourceMappingURL=arrow-loader.js.map