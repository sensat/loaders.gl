import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Hash } from './hash';
import md5WASM from './algorithms/md5-wasm';
import { hexToBase64 } from './utils/digest-utils';
export class MD5Hash extends Hash {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super();
    _defineProperty(this, "name", 'md5');
    _defineProperty(this, "options", void 0);
    this.options = options;
  }
  async hash(input) {
    const md5Promise = new Promise((resolve, reject) => md5WASM(input).then(resolve).catch(reject));
    const hex = await md5Promise;
    return hexToBase64(hex);
  }
}
//# sourceMappingURL=md5-hash.js.map