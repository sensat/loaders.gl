import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { concatenateArrayBuffersAsync } from '@loaders.gl/loader-utils';
export class Compression {
  constructor(options) {
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "extensions", void 0);
    _defineProperty(this, "contentEncodings", void 0);
    _defineProperty(this, "isSupported", void 0);
    this.compressBatches = this.compressBatches.bind(this);
    this.decompressBatches = this.decompressBatches.bind(this);
  }
  async preload() {
    return;
  }
  async compress(input) {
    await this.preload();
    return this.compressSync(input);
  }
  async decompress(input, size) {
    await this.preload();
    return this.decompressSync(input, size);
  }
  compressSync(input) {
    throw new Error("".concat(this.name, ": sync compression not supported"));
  }
  decompressSync(input, size) {
    throw new Error("".concat(this.name, ": sync decompression not supported"));
  }
  async *compressBatches(asyncIterator) {
    const input = await this.concatenate(asyncIterator);
    yield this.compress(input);
  }
  async *decompressBatches(asyncIterator) {
    const input = await this.concatenate(asyncIterator);
    yield this.decompress(input);
  }
  concatenate(asyncIterator) {
    return concatenateArrayBuffersAsync(asyncIterator);
  }
  improveError(error) {
    if (!error.message.includes(this.name)) {
      error.message = "".concat(this.name, " ").concat(error.message);
    }
    return error;
  }
}
//# sourceMappingURL=compression.js.map