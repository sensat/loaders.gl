import { createWorker } from '@loaders.gl/worker-utils';
import { NoCompression } from '../lib/no-compression';
import { BrotliCompression } from '../lib/brotli-compression';
import { DeflateCompression } from '../lib/deflate-compression';
import { GZipCompression } from '../lib/gzip-compression';
import { LZ4Compression } from '../lib/lz4-compression';
import { SnappyCompression } from '../lib/snappy-compression';
import { ZstdCompression } from '../lib/zstd-compression';
import lz4js from 'lz4js';
const modules = {
  lz4js
};
const COMPRESSIONS = [new NoCompression({
  modules
}), new BrotliCompression({
  modules
}), new DeflateCompression({
  modules
}), new GZipCompression({
  modules
}), new LZ4Compression({
  modules
}), new SnappyCompression({
  modules
}), new ZstdCompression({
  modules
})];
createWorker(async function (data) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const operation = getOperation(String(options === null || options === void 0 ? void 0 : options.operation));
  const compression = getCompression(String(options === null || options === void 0 ? void 0 : options.compression));
  switch (operation) {
    case 'compress':
      return await compression.compress(data);
    case 'decompress':
      return await compression.decompress(data);
    default:
      throw new Error('invalid option');
  }
});
function getOperation(operation) {
  switch (operation) {
    case 'compress':
    case 'deflate':
      return 'compress';
    case 'decompress':
    case 'inflate':
      return 'decompress';
    default:
      throw new Error("@loaders.gl/compression: Unsupported operation ".concat(operation, ". Expected 'compress' or 'decompress'"));
  }
}
function getCompression(name) {
  const Compression = COMPRESSIONS.find(compression_ => name === compression_.name);
  if (!Compression) {
    throw new Error("@loaders.gl/compression: Unsupported compression ".concat(name));
  }
  return Compression;
}
//# sourceMappingURL=worker.js.map