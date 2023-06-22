"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckOBJLoader = exports.OBJLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var OBJLoader = {
  name: 'OBJ',
  id: 'obj',
  module: 'obj',
  version: VERSION,
  worker: true,
  extensions: ['obj'],
  mimeTypes: ['text/plain'],
  testText: testOBJFile,
  options: {
    obj: {}
  }
};
exports.OBJLoader = OBJLoader;
function testOBJFile(text) {
  return text[0] === 'v';
}
var _typecheckOBJLoader = OBJLoader;
exports._typecheckOBJLoader = _typecheckOBJLoader;
//# sourceMappingURL=obj-loader.js.map