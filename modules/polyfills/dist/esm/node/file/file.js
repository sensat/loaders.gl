import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
let _Symbol$toStringTag;
import { BlobPolyfill } from './blob';
_Symbol$toStringTag = Symbol.toStringTag;
export class FilePolyfill extends BlobPolyfill {
  constructor(init, name) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    super(init, options);
    _defineProperty(this, "name", '');
    _defineProperty(this, "webkitRelativePath", '');
    _defineProperty(this, "lastModified", void 0);
    this.name = String(name).replace(/\//g, ':');
    this.lastModified = (options === null || options === void 0 ? void 0 : options.lastModified) || Date.now();
  }
  get [_Symbol$toStringTag]() {
    return 'File';
  }
}
//# sourceMappingURL=file.js.map