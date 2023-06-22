"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeGLTFSync = void 0;
const encode_glb_1 = require("./encode-glb");
/**
 * Encode the full glTF file as a binary GLB file
 * Returns an ArrayBuffer that represents the complete GLB image that can be saved to file
 *
 * @todo - Does not support encoding to non-GLB versions of glTF format. Other formats
 * - Encode as a textual JSON file with binary data in base64 data URLs.
 * - Encode as a JSON with all images (and buffers?) in separate binary files
 *
 * glb-file-format-specification
 * @see https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#
 *
 * @param gltf
 * @param arrayBuffer
 * @param byteOffset
 * @param options
 * @returns
 */
function encodeGLTFSync(gltf, arrayBuffer, byteOffset, options) {
    convertBuffersToBase64(gltf);
    // TODO: Copy buffers to binary
    return (0, encode_glb_1.encodeGLBSync)(gltf, arrayBuffer, byteOffset, options);
}
exports.encodeGLTFSync = encodeGLTFSync;
function convertBuffersToBase64(gltf, { firstBuffer = 0 } = {}) {
    if (gltf.buffers && gltf.buffers.length > firstBuffer) {
        throw new Error('encodeGLTF: multiple buffers not yet implemented');
    }
}
