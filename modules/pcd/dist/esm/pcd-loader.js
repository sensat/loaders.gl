const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const PCDLoader = {
  name: 'PCD (Point Cloud Data)',
  id: 'pcd',
  module: 'pcd',
  version: VERSION,
  worker: true,
  extensions: ['pcd'],
  mimeTypes: ['text/plain'],
  options: {
    pcd: {}
  }
};
//# sourceMappingURL=pcd-loader.js.map