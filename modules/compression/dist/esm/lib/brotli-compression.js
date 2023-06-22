import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Compression } from './compression';
import { isBrowser, toArrayBuffer } from '@loaders.gl/loader-utils';
import { BrotliDecode } from '../brotli/decode';
import zlib from 'zlib';
import { promisify1 } from '@loaders.gl/loader-utils';
const DEFAULT_BROTLI_OPTIONS = {
  brotli: {
    mode: 0,
    quality: 8,
    lgwin: 22
  }
};
let brotli;
export class BrotliCompression extends Compression {
  constructor(options) {
    super(options);
    _defineProperty(this, "name", 'brotli');
    _defineProperty(this, "extensions", ['br']);
    _defineProperty(this, "contentEncodings", ['br']);
    _defineProperty(this, "isSupported", true);
    _defineProperty(this, "options", void 0);
    this.options = options;
  }
  async preload() {
    var _this$options, _this$options$modules;
    brotli = brotli || ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules.brotli);
    if (!brotli) {
      console.warn("".concat(this.name, " library not installed"));
    }
  }
  async compress(input) {
    var _this$options$brotli;
    if (!isBrowser && (_this$options$brotli = this.options.brotli) !== null && _this$options$brotli !== void 0 && _this$options$brotli.useZlib) {
      const buffer = await promisify1(zlib.brotliCompress)(input);
      return toArrayBuffer(buffer);
    }
    return this.compressSync(input);
  }
  compressSync(input) {
    var _this$options$brotli2, _this$options2;
    if (!isBrowser && (_this$options$brotli2 = this.options.brotli) !== null && _this$options$brotli2 !== void 0 && _this$options$brotli2.useZlib) {
      const buffer = zlib.brotliCompressSync(input);
      return toArrayBuffer(buffer);
    }
    const brotliOptions = {
      ...DEFAULT_BROTLI_OPTIONS.brotli,
      ...((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.brotli)
    };
    const inputArray = new Uint8Array(input);
    if (!brotli) {
      throw new Error('brotli compression: brotli module not installed');
    }
    const outputArray = brotli.compress(inputArray, brotliOptions);
    return outputArray.buffer;
  }
  async decompress(input) {
    var _this$options$brotli3;
    if (!isBrowser && (_this$options$brotli3 = this.options.brotli) !== null && _this$options$brotli3 !== void 0 && _this$options$brotli3.useZlib) {
      const buffer = await promisify1(zlib.brotliDecompress)(input);
      return toArrayBuffer(buffer);
    }
    return this.decompressSync(input);
  }
  decompressSync(input) {
    var _this$options$brotli4, _this$options3;
    if (!isBrowser && (_this$options$brotli4 = this.options.brotli) !== null && _this$options$brotli4 !== void 0 && _this$options$brotli4.useZlib) {
      const buffer = zlib.brotliDecompressSync(input);
      return toArrayBuffer(buffer);
    }
    const brotliOptions = {
      ...DEFAULT_BROTLI_OPTIONS.brotli,
      ...((_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.brotli)
    };
    const inputArray = new Uint8Array(input);
    if (brotli) {
      const outputArray = brotli.decompress(inputArray, brotliOptions);
      return outputArray.buffer;
    }
    const outputArray = BrotliDecode(inputArray, undefined);
    return outputArray.buffer;
  }
}
//# sourceMappingURL=brotli-compression.js.map