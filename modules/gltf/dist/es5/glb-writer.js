"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._TypecheckGLBLoader = exports.GLBWriter = void 0;
var _encodeGlb = require("./lib/encoders/encode-glb");
var _version = require("./lib/utils/version");
var GLBWriter = {
  name: 'GLB',
  id: 'glb',
  module: 'gltf',
  version: _version.VERSION,
  extensions: ['glb'],
  mimeTypes: ['model/gltf-binary'],
  binary: true,
  encodeSync: encodeSync,
  options: {
    glb: {}
  }
};
exports.GLBWriter = GLBWriter;
function encodeSync(glb, options) {
  var _options$byteOffset = options.byteOffset,
    byteOffset = _options$byteOffset === void 0 ? 0 : _options$byteOffset;
  var byteLength = (0, _encodeGlb.encodeGLBSync)(glb, null, byteOffset, options);
  var arrayBuffer = new ArrayBuffer(byteLength);
  var dataView = new DataView(arrayBuffer);
  (0, _encodeGlb.encodeGLBSync)(glb, dataView, byteOffset, options);
  return arrayBuffer;
}
var _TypecheckGLBLoader = GLBWriter;
exports._TypecheckGLBLoader = _TypecheckGLBLoader;
//# sourceMappingURL=glb-writer.js.map