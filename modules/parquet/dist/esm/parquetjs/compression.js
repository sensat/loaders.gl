import { NoCompression, GZipCompression, SnappyCompression, BrotliCompression, LZ4Compression, ZstdCompression } from '@loaders.gl/compression';
function toBuffer(arrayBuffer) {
  return Buffer.from(arrayBuffer);
}
function toArrayBuffer(buffer) {
  if (Buffer.isBuffer(buffer)) {
    const typedArray = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length);
    return typedArray.slice().buffer;
  }
  return buffer;
}
import lz4js from 'lz4js';
const modules = {
  lz4js
};
export const PARQUET_COMPRESSION_METHODS = {
  UNCOMPRESSED: new NoCompression(),
  GZIP: new GZipCompression(),
  SNAPPY: new SnappyCompression(),
  BROTLI: new BrotliCompression({
    modules
  }),
  LZ4: new LZ4Compression({
    modules
  }),
  LZ4_RAW: new LZ4Compression({
    modules
  }),
  ZSTD: new ZstdCompression({
    modules
  })
};
export async function preloadCompressions(options) {
  const compressions = Object.values(PARQUET_COMPRESSION_METHODS);
  return await Promise.all(compressions.map(compression => compression.preload()));
}
export async function deflate(method, value) {
  const compression = PARQUET_COMPRESSION_METHODS[method];
  if (!compression) {
    throw new Error("parquet: invalid compression method: ".concat(method));
  }
  const inputArrayBuffer = toArrayBuffer(value);
  const compressedArrayBuffer = await compression.compress(inputArrayBuffer);
  return toBuffer(compressedArrayBuffer);
}
export async function decompress(method, value, size) {
  const compression = PARQUET_COMPRESSION_METHODS[method];
  if (!compression) {
    throw new Error("parquet: invalid compression method: ".concat(method));
  }
  const inputArrayBuffer = toArrayBuffer(value);
  const compressedArrayBuffer = await compression.decompress(inputArrayBuffer, size);
  return toBuffer(compressedArrayBuffer);
}
export function inflate(method, value, size) {
  if (!(method in PARQUET_COMPRESSION_METHODS)) {
    throw new Error("invalid compression method: ".concat(method));
  }
  return PARQUET_COMPRESSION_METHODS[method].inflate(value, size);
}
//# sourceMappingURL=compression.js.map