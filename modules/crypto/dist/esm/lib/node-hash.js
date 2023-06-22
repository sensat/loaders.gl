import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Hash } from './hash';
import { createHash } from 'crypto';
export class NodeHash extends Hash {
  constructor(options) {
    var _this$options, _this$options$crypto;
    super();
    _defineProperty(this, "name", 'crypto-node');
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "_algorithm", void 0);
    _defineProperty(this, "_hash", void 0);
    this.options = options;
    if (!((_this$options = this.options) !== null && _this$options !== void 0 && (_this$options$crypto = _this$options.crypto) !== null && _this$options$crypto !== void 0 && _this$options$crypto.algorithm)) {
      throw new Error(this.name);
    }
  }
  async hash(input) {
    var _this$options2, _this$options2$crypto, _this$options2$crypto2;
    await this.preload();
    const hash = createHash((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : (_this$options2$crypto = _this$options2.crypto) === null || _this$options2$crypto === void 0 ? void 0 : (_this$options2$crypto2 = _this$options2$crypto.algorithm) === null || _this$options2$crypto2 === void 0 ? void 0 : _this$options2$crypto2.toLowerCase());
    const inputArray = new Uint8Array(input);
    return hash.update(inputArray).digest('base64');
  }
  async *hashBatches(asyncIterator) {
    var _this$options3, _this$options3$crypto, _this$options3$crypto2, _this$options4, _this$options4$crypto, _this$options4$crypto2;
    await this.preload();
    const hash = createHash((_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : (_this$options3$crypto = _this$options3.crypto) === null || _this$options3$crypto === void 0 ? void 0 : (_this$options3$crypto2 = _this$options3$crypto.algorithm) === null || _this$options3$crypto2 === void 0 ? void 0 : _this$options3$crypto2.toLowerCase());
    for await (const chunk of asyncIterator) {
      const inputArray = new Uint8Array(chunk);
      hash.update(inputArray);
      yield chunk;
    }
    (_this$options4 = this.options) === null || _this$options4 === void 0 ? void 0 : (_this$options4$crypto = _this$options4.crypto) === null || _this$options4$crypto === void 0 ? void 0 : (_this$options4$crypto2 = _this$options4$crypto.onEnd) === null || _this$options4$crypto2 === void 0 ? void 0 : _this$options4$crypto2.call(_this$options4$crypto, {
      hash: hash.digest('base64')
    });
  }
}
//# sourceMappingURL=node-hash.js.map