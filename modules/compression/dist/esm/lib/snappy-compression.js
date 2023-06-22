import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Compression } from './compression';
import { compress, uncompress } from 'snappyjs';
export class SnappyCompression extends Compression {
  constructor(options) {
    super(options);
    _defineProperty(this, "name", 'snappy');
    _defineProperty(this, "extensions", []);
    _defineProperty(this, "contentEncodings", []);
    _defineProperty(this, "isSupported", true);
    _defineProperty(this, "options", void 0);
    this.options = options || {};
  }
  compressSync(input) {
    return compress(input);
  }
  decompressSync(input) {
    return uncompress(input);
  }
}
//# sourceMappingURL=snappy-compression.js.map