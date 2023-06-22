import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { DeflateCompression } from './deflate-compression';
export class GZipCompression extends DeflateCompression {
  constructor(options) {
    super({
      ...options,
      deflate: {
        ...(options === null || options === void 0 ? void 0 : options.gzip),
        gzip: true
      }
    });
    _defineProperty(this, "name", 'gzip');
    _defineProperty(this, "extensions", ['gz', 'gzip']);
    _defineProperty(this, "contentEncodings", ['gzip', 'x-gzip']);
    _defineProperty(this, "isSupported", true);
  }
}
//# sourceMappingURL=gzip-compression.js.map