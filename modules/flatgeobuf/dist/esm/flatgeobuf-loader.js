const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const FlatGeobufLoader = {
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
export const _typecheckFlatGeobufLoader = FlatGeobufLoader;
//# sourceMappingURL=flatgeobuf-loader.js.map