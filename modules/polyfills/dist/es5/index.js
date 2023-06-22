"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BlobPolyfill", {
  enumerable: true,
  get: function get() {
    return _blob.BlobPolyfill;
  }
});
Object.defineProperty(exports, "FilePolyfill", {
  enumerable: true,
  get: function get() {
    return _file.FilePolyfill;
  }
});
Object.defineProperty(exports, "FileReaderPolyfill", {
  enumerable: true,
  get: function get() {
    return _fileReader.FileReaderPolyfill;
  }
});
Object.defineProperty(exports, "ReadableStreamPolyfill", {
  enumerable: true,
  get: function get() {
    return _readableStream.ReadableStreamPolyfill;
  }
});
Object.defineProperty(exports, "_fetchFileNode", {
  enumerable: true,
  get: function get() {
    return _fetchFile.fetchFileNode;
  }
});
Object.defineProperty(exports, "_fetchNode", {
  enumerable: true,
  get: function get() {
    return _fetch.fetchNode;
  }
});
Object.defineProperty(exports, "installFilePolyfills", {
  enumerable: true,
  get: function get() {
    return _installFilePolyfills.installFilePolyfills;
  }
});
var _globals = require("./utils/globals");
var _encoding = require("./lib/encoding");
var _allSettled = require("./promise/all-settled");
var base64 = _interopRequireWildcard(require("./node/buffer/btoa.node"));
var _headers = require("./node/fetch/headers.node");
var _response = require("./node/fetch/response.node");
var _fetch = require("./node/fetch/fetch.node");
var _encodeImage = require("./node/images/encode-image.node");
var _parseImage = require("./node/images/parse-image.node");
var _readableStream = require("./node/file/readable-stream");
var _blob = require("./node/file/blob");
var _fileReader = require("./node/file/file-reader");
var _file = require("./node/file/file");
var _installFilePolyfills = require("./node/file/install-file-polyfills");
var _fetchFile = require("./node/fetch/fetch-file.node");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var installTextEncoder = !_globals.isBrowser || !('TextEncoder' in _globals.global);
if (installTextEncoder) {
  _globals.global['TextEncoder'] = _encoding.TextEncoder;
}
var installTextDecoder = !_globals.isBrowser || !('TextDecoder' in _globals.global);
if (installTextDecoder) {
  _globals.global['TextDecoder'] = _encoding.TextDecoder;
}
if (!_globals.isBrowser && !('atob' in _globals.global) && base64.atob) {
  _globals.global['atob'] = base64.atob;
}
if (!_globals.isBrowser && !('btoa' in _globals.global) && base64.btoa) {
  _globals.global['btoa'] = base64.btoa;
}
if (!_globals.isBrowser && !('Headers' in _globals.global) && _headers.Headers) {
  _globals.global['Headers'] = _headers.Headers;
}
if (!_globals.isBrowser && !('Response' in _globals.global) && _response.Response) {
  _globals.global['Response'] = _response.Response;
}
if (!_globals.isBrowser && !('fetch' in _globals.global) && _fetch.fetchNode) {
  _globals.global['fetch'] = _fetch.fetchNode;
}
if (!_globals.isBrowser && !('_encodeImageNode' in _globals.global) && _encodeImage.encodeImageNode) {
  _globals.global['_encodeImageNode'] = _encodeImage.encodeImageNode;
}
if (!_globals.isBrowser && !('_parseImageNode' in _globals.global) && _parseImage.parseImageNode) {
  _globals.global['_parseImageNode'] = _parseImage.parseImageNode;
  _globals.global['_imageFormatsNode'] = _parseImage.NODE_FORMAT_SUPPORT;
}
if (!('allSettled' in Promise)) {
  Promise.allSettled = _allSettled.allSettled;
}
//# sourceMappingURL=index.js.map