const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const MTLLoader = {
  name: 'MTL',
  id: 'mtl',
  module: 'mtl',
  version: VERSION,
  worker: true,
  extensions: ['mtl'],
  mimeTypes: ['text/plain'],
  testText: text => text.includes('newmtl'),
  options: {
    mtl: {}
  }
};
export const _typecheckMTLLoader = MTLLoader;
//# sourceMappingURL=mtl-loader.js.map