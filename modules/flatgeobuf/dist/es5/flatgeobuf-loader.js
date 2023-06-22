"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckFlatGeobufLoader = exports.FlatGeobufLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var FlatGeobufLoader = {
  id: 'flatgeobuf',
  name: 'FlatGeobuf',
  module: 'flatgeobuf',
  version: VERSION,
  worker: true,
  extensions: ['fgb'],
  mimeTypes: ['application/octet-stream'],
  category: 'geometry',
  options: {
    flatgeobuf: {
      shape: 'geojson'
    }
  }
};
exports.FlatGeobufLoader = FlatGeobufLoader;
var _typecheckFlatGeobufLoader = FlatGeobufLoader;
exports._typecheckFlatGeobufLoader = _typecheckFlatGeobufLoader;
//# sourceMappingURL=flatgeobuf-loader.js.map