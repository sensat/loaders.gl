import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { concatenateArrayBuffersAsync } from '@loaders.gl/loader-utils';
export class Hash {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "options", void 0);
    this.hashBatches = this.hashBatches.bind(this);
  }
  async preload() {
    return;
  }
  async *hashBatches(asyncIterator) {
    var _this$options$crypto, _this$options$crypto$;
    const arrayBuffers = [];
    for await (const arrayBuffer of asyncIterator) {
      arrayBuffers.push(arrayBuffer);
      yield arrayBuffer;
    }
    const output = await this.concatenate(arrayBuffers);
    const hash = await this.hash(output);
    (_this$options$crypto = this.options.crypto) === null || _this$options$crypto === void 0 ? void 0 : (_this$options$crypto$ = _this$options$crypto.onEnd) === null || _this$options$crypto$ === void 0 ? void 0 : _this$options$crypto$.call(_this$options$crypto, {
      hash
    });
  }
  async concatenate(asyncIterator) {
    return await concatenateArrayBuffersAsync(asyncIterator);
  }
}
//# sourceMappingURL=hash.js.map