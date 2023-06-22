"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PCDLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var PCDLoader = {
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
exports.PCDLoader = PCDLoader;
//# sourceMappingURL=pcd-loader.js.map