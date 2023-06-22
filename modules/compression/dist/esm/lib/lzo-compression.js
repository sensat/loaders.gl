import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { toBuffer } from '@loaders.gl/loader-utils';
import { Compression } from './compression';
let lzo;
export class LZOCompression extends Compression {
  constructor(options) {
    var _this$options, _this$options$modules;
    super(options);
    _defineProperty(this, "name", 'lzo');
    _defineProperty(this, "extensions", []);
    _defineProperty(this, "contentEncodings", []);
    _defineProperty(this, "isSupported", false);
    _defineProperty(this, "options", void 0);
    this.options = options;
    lzo = lzo || ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules.lzo);
    if (!lzo) {
      throw new Error(this.name);
    }
  }
  async preload() {}
  async compress(input) {
    await this.preload();
    const inputBuffer = toBuffer(input);
    return lzo.compress(inputBuffer).buffer;
  }
  async decompress(input) {
    try {
      await this.preload();
      const inputBuffer = toBuffer(input);
      return lzo.decompress(inputBuffer).buffer;
    } catch (error) {
      throw error;
    }
  }
}
//# sourceMappingURL=lzo-compression.js.map