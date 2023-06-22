"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installFilePolyfills = installFilePolyfills;
var _readableStream = require("./readable-stream");
var _blob = require("./blob");
var _fileReader = require("./file-reader");
var _file = require("./file");
function installFilePolyfills() {
  if (typeof ReadableStream === 'undefined' && global) {
    global.ReadableStream = _readableStream.ReadableStreamPolyfill;
  }
  if (typeof Blob === 'undefined' && global) {
    global.Blob = _blob.BlobPolyfill;
  }
  if (typeof FileReader === 'undefined' && global) {
    global.FileReader = _fileReader.FileReaderPolyfill;
  }
  if (typeof File === 'undefined' && global) {
    global.File = _file.FilePolyfill;
  }
}
//# sourceMappingURL=install-file-polyfills.js.map