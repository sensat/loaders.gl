"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompressedTextureWriter = void 0;
var _version = require("./lib/utils/version");
var _encodeTexture = require("./lib/encoders/encode-texture");
var CompressedTextureWriter = {
  name: 'DDS Texture Container',
  id: 'dds',
  module: 'textures',
  version: _version.VERSION,
  extensions: ['dds'],
  options: {
    texture: {
      format: 'auto',
      compression: 'auto',
      quality: 'auto',
      mipmap: false,
      flipY: false,
      toolFlags: ''
    }
  },
  encodeURLtoURL: _encodeTexture.encodeImageURLToCompressedTextureURL
};
exports.CompressedTextureWriter = CompressedTextureWriter;
//# sourceMappingURL=compressed-texture-writer.js.map