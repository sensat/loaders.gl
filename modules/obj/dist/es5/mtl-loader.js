"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckMTLLoader = exports.MTLLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var MTLLoader = {
  name: 'MTL',
  id: 'mtl',
  module: 'mtl',
  version: VERSION,
  worker: true,
  extensions: ['mtl'],
  mimeTypes: ['text/plain'],
  testText: function testText(text) {
    return text.includes('newmtl');
  },
  options: {
    mtl: {}
  }
};
exports.MTLLoader = MTLLoader;
var _typecheckMTLLoader = MTLLoader;
exports._typecheckMTLLoader = _typecheckMTLLoader;
//# sourceMappingURL=mtl-loader.js.map