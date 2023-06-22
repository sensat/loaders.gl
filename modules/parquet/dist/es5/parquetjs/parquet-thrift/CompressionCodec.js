"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompressionCodec = void 0;
var CompressionCodec = function (CompressionCodec) {
  CompressionCodec[CompressionCodec["UNCOMPRESSED"] = 0] = "UNCOMPRESSED";
  CompressionCodec[CompressionCodec["SNAPPY"] = 1] = "SNAPPY";
  CompressionCodec[CompressionCodec["GZIP"] = 2] = "GZIP";
  CompressionCodec[CompressionCodec["LZO"] = 3] = "LZO";
  CompressionCodec[CompressionCodec["BROTLI"] = 4] = "BROTLI";
  CompressionCodec[CompressionCodec["LZ4"] = 5] = "LZ4";
  CompressionCodec[CompressionCodec["ZSTD"] = 6] = "ZSTD";
  CompressionCodec[CompressionCodec["LZ4_RAW"] = 7] = "LZ4_RAW";
  return CompressionCodec;
}({});
exports.CompressionCodec = CompressionCodec;
//# sourceMappingURL=CompressionCodec.js.map