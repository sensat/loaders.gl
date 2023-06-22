"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuantizedMeshLoader = void 0;
var _version = require("./lib/utils/version");
var QuantizedMeshLoader = {
  name: 'Quantized Mesh',
  id: 'quantized-mesh',
  module: 'terrain',
  version: _version.VERSION,
  worker: true,
  extensions: ['terrain'],
  mimeTypes: ['application/vnd.quantized-mesh'],
  options: {
    'quantized-mesh': {
      bounds: [0, 0, 1, 1],
      skirtHeight: null
    }
  }
};
exports.QuantizedMeshLoader = QuantizedMeshLoader;
//# sourceMappingURL=quantized-mesh-loader.js.map