import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Hash } from './hash';
import CRC32 from './algorithms/crc32';
import { toHex, hexToBase64 } from './utils/digest-utils';
export class CRC32Hash extends Hash {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super();
    _defineProperty(this, "name", 'crc32');
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "_hash", void 0);
    this.options = {
      crypto: {},
      ...options
    };
    this._hash = new CRC32();
    this.hashBatches = this.hashBatches.bind(this);
  }
  async hash(input) {
    return this.hashSync(input);
  }
  hashSync(input) {
    this._hash.update(input);
    const hashValue = this._hash.finalize();
    const hex = toHex(hashValue);
    const hash = hexToBase64(hex);
    return hash;
  }
  async *hashBatches(asyncIterator) {
    var _this$options$crypto, _this$options$crypto$;
    for await (const chunk of asyncIterator) {
      this._hash.update(chunk);
      yield chunk;
    }
    const hashValue = this._hash.finalize();
    const hex = toHex(hashValue);
    const hash = hexToBase64(hex);
    (_this$options$crypto = this.options.crypto) === null || _this$options$crypto === void 0 ? void 0 : (_this$options$crypto$ = _this$options$crypto.onEnd) === null || _this$options$crypto$ === void 0 ? void 0 : _this$options$crypto$.call(_this$options$crypto, {
      hash
    });
  }
}
//# sourceMappingURL=crc32-hash.js.map