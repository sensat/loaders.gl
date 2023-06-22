"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installFilePolyfills = void 0;
const readable_stream_1 = require("./readable-stream");
const blob_1 = require("./blob");
const file_reader_1 = require("./file-reader");
const file_1 = require("./file");
function installFilePolyfills() {
    if (typeof ReadableStream === 'undefined' && global) {
        // @ts-ignore;
        global.ReadableStream = readable_stream_1.ReadableStreamPolyfill;
    }
    if (typeof Blob === 'undefined' && global) {
        // @ts-ignore;
        global.Blob = blob_1.BlobPolyfill;
    }
    if (typeof FileReader === 'undefined' && global) {
        // @ts-ignore;
        global.FileReader = file_reader_1.FileReaderPolyfill;
    }
    // Install minimal Node.js File polyfill
    if (typeof File === 'undefined' && global) {
        // @ts-ignore;
        global.File = file_1.FilePolyfill;
    }
}
exports.installFilePolyfills = installFilePolyfills;
