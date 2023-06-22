"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getMemoryUsageGLTF = exports.postProcessGLTF = exports.GLTFScenegraph = exports.GLBWriter = exports.GLBLoader = exports.GLTFWriter = exports.GLTFLoader = void 0;
// glTF loader/writer definition objects
var gltf_loader_1 = require("./gltf-loader");
Object.defineProperty(exports, "GLTFLoader", { enumerable: true, get: function () { return gltf_loader_1.GLTFLoader; } });
var gltf_writer_1 = require("./gltf-writer");
Object.defineProperty(exports, "GLTFWriter", { enumerable: true, get: function () { return gltf_writer_1.GLTFWriter; } });
// GLB Loader & Writer (for custom formats that want to leverage the GLB binary "envelope")
var glb_loader_1 = require("./glb-loader");
Object.defineProperty(exports, "GLBLoader", { enumerable: true, get: function () { return glb_loader_1.GLBLoader; } });
var glb_writer_1 = require("./glb-writer");
Object.defineProperty(exports, "GLBWriter", { enumerable: true, get: function () { return glb_writer_1.GLBWriter; } });
// glTF Data Access Helper Class
var gltf_scenegraph_1 = require("./lib/api/gltf-scenegraph");
Object.defineProperty(exports, "GLTFScenegraph", { enumerable: true, get: function () { return gltf_scenegraph_1.GLTFScenegraph; } });
var post_process_gltf_1 = require("./lib/api/post-process-gltf");
Object.defineProperty(exports, "postProcessGLTF", { enumerable: true, get: function () { return post_process_gltf_1.postProcessGLTF; } });
var gltf_utils_1 = require("./lib/gltf-utils/gltf-utils");
Object.defineProperty(exports, "_getMemoryUsageGLTF", { enumerable: true, get: function () { return gltf_utils_1.getMemoryUsageGLTF; } });
/** @deprecated */
// export type {GLTFMesh as Mesh} from './lib/types/gltf-json-schema.js';
/** @deprecated */
// export type {GLTFNodePostprocessed as Node} from './lib/types/gltf-postprocessed-schema.js';
/** @deprecated */
// export type {GLTFAccessorPostprocessed as Accessor} from './lib/types/gltf-postprocessed-schema.js';
// /** @deprecated */
// export type {GLTFImagePostprocessed as Image} from './lib/types/gltf-postprocessed-schema.js';
