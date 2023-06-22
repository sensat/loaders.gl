"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BrotliCompression", {
  enumerable: true,
  get: function get() {
    return _brotliCompression.BrotliCompression;
  }
});
Object.defineProperty(exports, "Compression", {
  enumerable: true,
  get: function get() {
    return _compression.Compression;
  }
});
Object.defineProperty(exports, "CompressionWorker", {
  enumerable: true,
  get: function get() {
    return _compressionWorker.CompressionWorker;
  }
});
Object.defineProperty(exports, "DeflateCompression", {
  enumerable: true,
  get: function get() {
    return _deflateCompression.DeflateCompression;
  }
});
Object.defineProperty(exports, "GZipCompression", {
  enumerable: true,
  get: function get() {
    return _gzipCompression.GZipCompression;
  }
});
Object.defineProperty(exports, "LZ4Compression", {
  enumerable: true,
  get: function get() {
    return _lz4Compression.LZ4Compression;
  }
});
Object.defineProperty(exports, "LZOCompression", {
  enumerable: true,
  get: function get() {
    return _lzoCompression.LZOCompression;
  }
});
Object.defineProperty(exports, "NoCompression", {
  enumerable: true,
  get: function get() {
    return _noCompression.NoCompression;
  }
});
Object.defineProperty(exports, "SnappyCompression", {
  enumerable: true,
  get: function get() {
    return _snappyCompression.SnappyCompression;
  }
});
Object.defineProperty(exports, "ZstdCompression", {
  enumerable: true,
  get: function get() {
    return _zstdCompression.ZstdCompression;
  }
});
Object.defineProperty(exports, "compressOnWorker", {
  enumerable: true,
  get: function get() {
    return _compressionWorker.compressOnWorker;
  }
});
var _compression = require("./lib/compression");
var _noCompression = require("./lib/no-compression");
var _deflateCompression = require("./lib/deflate-compression");
var _gzipCompression = require("./lib/gzip-compression");
var _brotliCompression = require("./lib/brotli-compression");
var _snappyCompression = require("./lib/snappy-compression");
var _lz4Compression = require("./lib/lz4-compression");
var _zstdCompression = require("./lib/zstd-compression");
var _lzoCompression = require("./lib/lzo-compression");
var _compressionWorker = require("./compression-worker");
//# sourceMappingURL=index.js.map