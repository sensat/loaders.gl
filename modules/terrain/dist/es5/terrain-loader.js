"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TerrainLoader = void 0;
var _version = require("./lib/utils/version");
var TerrainLoader = {
  name: 'Terrain',
  id: 'terrain',
  module: 'terrain',
  version: _version.VERSION,
  worker: true,
  extensions: ['png', 'pngraw', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'],
  mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp'],
  options: {
    terrain: {
      tesselator: 'auto',
      bounds: undefined,
      meshMaxError: 10,
      elevationDecoder: {
        rScaler: 1,
        gScaler: 0,
        bScaler: 0,
        offset: 0
      },
      skirtHeight: undefined
    }
  }
};
exports.TerrainLoader = TerrainLoader;
//# sourceMappingURL=terrain-loader.js.map