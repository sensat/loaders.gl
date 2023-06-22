"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressedTextureWriter = void 0;
const version_1 = require("./lib/utils/version");
const encode_texture_1 = require("./lib/encoders/encode-texture");
/**
 * DDS Texture Container Exporter
 */
exports.CompressedTextureWriter = {
    name: 'DDS Texture Container',
    id: 'dds',
    module: 'textures',
    version: version_1.VERSION,
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
    encodeURLtoURL: encode_texture_1.encodeImageURLToCompressedTextureURL
};
// TYPE TESTS - TODO find a better way than exporting junk
// export const _TypecheckCompressedTextureWriter: typeof CompressedTextureWriter & {
//   encodeURLtoURL: (
//     inputUrl: string,
//     outputUrl: string,
//     options?: CompressedTextureWriterOptions
//   ) => Promise<string>;
// } = CompressedTextureWriter;
