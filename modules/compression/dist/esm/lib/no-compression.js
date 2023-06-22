import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Compression } from './compression';
export class NoCompression extends Compression {
  constructor(options) {
    super(options);
    _defineProperty(this, "name", 'uncompressed');
    _defineProperty(this, "extensions", []);
    _defineProperty(this, "contentEncodings", []);
    _defineProperty(this, "isSupported", true);
    _defineProperty(this, "options", void 0);
    this.options = options || {};
  }
  compressSync(input) {
    return input;
  }
  decompressSync(input) {
    return input;
  }
  async *compressBatches(asyncIterator) {
    return yield* asyncIterator;
  }
  async *decompressBatches(asyncIterator) {
    return yield* asyncIterator;
  }
}
//# sourceMappingURL=no-compression.js.map