"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports._TypecheckGLBLoader = exports.GLBWriter = void 0;
const encode_glb_1 = require("./lib/encoders/encode-glb");
const version_1 = require("./lib/utils/version");
/**
 * GLB exporter
 * GLB is the binary container format for GLTF
 */
exports.GLBWriter = {
    name: 'GLB',
    id: 'glb',
    module: 'gltf',
    version: version_1.VERSION,
    extensions: ['glb'],
    mimeTypes: ['model/gltf-binary'],
    binary: true,
    encodeSync,
    options: {
        glb: {}
    }
};
function encodeSync(glb, options) {
    const { byteOffset = 0 } = options;
    // Calculate length and allocate buffer
    const byteLength = (0, encode_glb_1.encodeGLBSync)(glb, null, byteOffset, options);
    const arrayBuffer = new ArrayBuffer(byteLength);
    // Encode into buffer
    const dataView = new DataView(arrayBuffer);
    (0, encode_glb_1.encodeGLBSync)(glb, dataView, byteOffset, options);
    return arrayBuffer;
}
// TYPE TESTS - TODO find a better way than exporting junk
exports._TypecheckGLBLoader = exports.GLBWriter;
