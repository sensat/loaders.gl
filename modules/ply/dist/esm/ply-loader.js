const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const PLYLoader = {
  name: 'PLY',
  id: 'ply',
  module: 'ply',
  version: VERSION,
  worker: true,
  extensions: ['ply'],
  mimeTypes: ['text/plain', 'application/octet-stream'],
  text: true,
  binary: true,
  tests: ['ply'],
  options: {
    ply: {}
  }
};
export const _typecheckPLYLoader = PLYLoader;
//# sourceMappingURL=ply-loader.js.map