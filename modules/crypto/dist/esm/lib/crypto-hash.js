import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Hash } from './hash';
let CryptoJS;
export class CryptoHash extends Hash {
  constructor(options) {
    var _this$options, _this$options$crypto;
    super();
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "_algorithm", void 0);
    _defineProperty(this, "_hash", void 0);
    this.options = options;
    this._algorithm = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$crypto = _this$options.crypto) === null || _this$options$crypto === void 0 ? void 0 : _this$options$crypto.algorithm;
    if (!this._algorithm) {
      throw new Error(this.name);
    }
    this.name = this._algorithm.toLowerCase();
  }
  async preload() {
    if (!CryptoJS) {
      var _this$options2, _this$options2$module;
      CryptoJS = (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : (_this$options2$module = _this$options2.modules) === null || _this$options2$module === void 0 ? void 0 : _this$options2$module.CryptoJS;
      if (!CryptoJS) {
        throw new Error(this.name);
      }
    }
    if (!this._hash) {
      const algo = CryptoJS.algo[this._algorithm];
      this._hash = algo.create();
    }
    if (!this._hash) {
      throw new Error(this.name);
    }
  }
  async hash(input) {
    await this.preload();
    const typedWordArray = CryptoJS.lib.WordArray.create(input);
    return this._hash.update(typedWordArray).finalize().toString(CryptoJS.enc.Base64);
  }
  async *hashBatches(asyncIterator) {
    var _this$options3, _this$options3$crypto, _this$options3$crypto2;
    await this.preload();
    for await (const chunk of asyncIterator) {
      const typedWordArray = CryptoJS.lib.WordArray.create(chunk);
      this._hash.update(typedWordArray);
      yield chunk;
    }
    const hash = this._hash.finalize().toString(CryptoJS.enc.Base64);
    (_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : (_this$options3$crypto = _this$options3.crypto) === null || _this$options3$crypto === void 0 ? void 0 : (_this$options3$crypto2 = _this$options3$crypto.onEnd) === null || _this$options3$crypto2 === void 0 ? void 0 : _this$options3$crypto2.call(_this$options3$crypto, {
      hash
    });
  }
}
//# sourceMappingURL=crypto-hash.js.map