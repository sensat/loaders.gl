import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Compression } from './compression';
let ZstdCodec;
let zstd;
export class ZstdCompression extends Compression {
  constructor(options) {
    var _this$options, _this$options$modules;
    super(options);
    _defineProperty(this, "name", 'zstd');
    _defineProperty(this, "extensions", []);
    _defineProperty(this, "contentEncodings", []);
    _defineProperty(this, "isSupported", true);
    _defineProperty(this, "options", void 0);
    this.options = options;
    ZstdCodec = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules['zstd-codec'];
    if (!ZstdCodec) {
      console.warn("".concat(this.name, " library not installed"));
    }
  }
  async preload() {
    if (!zstd && ZstdCodec) {
      zstd = await new Promise(resolve => ZstdCodec.run(zstd => resolve(zstd)));
    }
  }
  compressSync(input) {
    const simpleZstd = new zstd.Simple();
    const inputArray = new Uint8Array(input);
    return simpleZstd.compress(inputArray).buffer;
  }
  decompressSync(input) {
    const simpleZstd = new zstd.Simple();
    const inputArray = new Uint8Array(input);
    return simpleZstd.decompress(inputArray).buffer;
  }
}
//# sourceMappingURL=zstd-compression.js.map