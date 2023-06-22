"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._fetchFileNode = exports._fetchNode = exports.installFilePolyfills = exports.FilePolyfill = exports.FileReaderPolyfill = exports.BlobPolyfill = exports.ReadableStreamPolyfill = void 0;
/* eslint-disable dot-notation */
const globals_1 = require("./utils/globals");
const encoding_1 = require("./lib/encoding");
const all_settled_1 = require("./promise/all-settled");
// Node specific
const base64 = __importStar(require("./node/buffer/btoa.node"));
const headers_node_1 = require("./node/fetch/headers.node");
const response_node_1 = require("./node/fetch/response.node");
const fetch_node_1 = require("./node/fetch/fetch.node");
const encode_image_node_1 = require("./node/images/encode-image.node");
const parse_image_node_1 = require("./node/images/parse-image.node");
var readable_stream_1 = require("./node/file/readable-stream");
Object.defineProperty(exports, "ReadableStreamPolyfill", { enumerable: true, get: function () { return readable_stream_1.ReadableStreamPolyfill; } });
var blob_1 = require("./node/file/blob");
Object.defineProperty(exports, "BlobPolyfill", { enumerable: true, get: function () { return blob_1.BlobPolyfill; } });
var file_reader_1 = require("./node/file/file-reader");
Object.defineProperty(exports, "FileReaderPolyfill", { enumerable: true, get: function () { return file_reader_1.FileReaderPolyfill; } });
var file_1 = require("./node/file/file");
Object.defineProperty(exports, "FilePolyfill", { enumerable: true, get: function () { return file_1.FilePolyfill; } });
var install_file_polyfills_1 = require("./node/file/install-file-polyfills");
Object.defineProperty(exports, "installFilePolyfills", { enumerable: true, get: function () { return install_file_polyfills_1.installFilePolyfills; } });
var fetch_node_2 = require("./node/fetch/fetch.node");
Object.defineProperty(exports, "_fetchNode", { enumerable: true, get: function () { return fetch_node_2.fetchNode; } });
var fetch_file_node_1 = require("./node/fetch/fetch-file.node");
Object.defineProperty(exports, "_fetchFileNode", { enumerable: true, get: function () { return fetch_file_node_1.fetchFileNode; } });
// POLYFILLS: TextEncoder, TextDecoder
// - Recent Node versions have these classes but virtually no encodings unless special build.
// - Browser: Edge, IE11 do not have these
const installTextEncoder = !globals_1.isBrowser || !('TextEncoder' in globals_1.global);
if (installTextEncoder) {
    globals_1.global['TextEncoder'] = encoding_1.TextEncoder;
}
const installTextDecoder = !globals_1.isBrowser || !('TextDecoder' in globals_1.global);
if (installTextDecoder) {
    globals_1.global['TextDecoder'] = encoding_1.TextDecoder;
}
// POLYFILLS: btoa, atob
// - Node: Yes
// - Browser: No
if (!globals_1.isBrowser && !('atob' in globals_1.global) && base64.atob) {
    globals_1.global['atob'] = base64.atob;
}
if (!globals_1.isBrowser && !('btoa' in globals_1.global) && base64.btoa) {
    globals_1.global['btoa'] = base64.btoa;
}
// POLYFILL: fetch
// - Node: Yes
// - Browser: No. For This polyfill is node only, IE11 etc, install external polyfill
if (!globals_1.isBrowser && !('Headers' in globals_1.global) && headers_node_1.Headers) {
    globals_1.global['Headers'] = headers_node_1.Headers;
}
if (!globals_1.isBrowser && !('Response' in globals_1.global) && response_node_1.Response) {
    globals_1.global['Response'] = response_node_1.Response;
}
if (!globals_1.isBrowser && !('fetch' in globals_1.global) && fetch_node_1.fetchNode) {
    globals_1.global['fetch'] = fetch_node_1.fetchNode;
}
// NODE IMAGE FUNCTIONS:
// These are not official polyfills but used by the @loaders.gl/images module if installed
// TODO - is there an appropriate Image API we could polyfill using an adapter?
if (!globals_1.isBrowser && !('_encodeImageNode' in globals_1.global) && encode_image_node_1.encodeImageNode) {
    globals_1.global['_encodeImageNode'] = encode_image_node_1.encodeImageNode;
}
if (!globals_1.isBrowser && !('_parseImageNode' in globals_1.global) && parse_image_node_1.parseImageNode) {
    globals_1.global['_parseImageNode'] = parse_image_node_1.parseImageNode;
    globals_1.global['_imageFormatsNode'] = parse_image_node_1.NODE_FORMAT_SUPPORT;
}
if (!('allSettled' in Promise)) {
    // @ts-ignore
    Promise.allSettled = all_settled_1.allSettled;
}
