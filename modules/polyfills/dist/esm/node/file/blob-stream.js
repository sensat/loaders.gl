import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
let _Symbol$asyncIterator;
import { ReadableStreamPolyfill } from './readable-stream';
import { BlobStreamController } from './blob-stream-controller';
_Symbol$asyncIterator = Symbol.asyncIterator;
export class BlobStream extends ReadableStreamPolyfill {
  constructor(chunks) {
    super(new BlobStreamController(chunks.values()), {
      type: 'bytes'
    });
    _defineProperty(this, "_chunks", void 0);
    this._chunks = chunks;
  }
  async *[_Symbol$asyncIterator](_options) {
    const reader = this.getReader();
    yield* this._chunks;
    reader.releaseLock();
  }
}
//# sourceMappingURL=blob-stream.js.map