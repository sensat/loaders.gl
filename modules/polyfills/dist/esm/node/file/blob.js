import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
let _Symbol$toStringTag;
import { BlobStream } from './blob-stream';
_Symbol$toStringTag = Symbol.toStringTag;
export class BlobPolyfill {
  constructor() {
    let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "size", void 0);
    _defineProperty(this, "parts", void 0);
    this.parts = [];
    this.size = 0;
    for (const part of init) {
      if (typeof part === 'string') {
        const bytes = new TextEncoder().encode(part);
        this.parts.push(bytes);
        this.size += bytes.byteLength;
      } else if (part instanceof BlobPolyfill) {
        this.size += part.size;
        this.parts.push(...part.parts);
      } else if (part instanceof ArrayBuffer) {
        this.parts.push(new Uint8Array(part));
        this.size += part.byteLength;
      } else if (part instanceof Uint8Array) {
        this.parts.push(part);
        this.size += part.byteLength;
      } else if (ArrayBuffer.isView(part)) {
        const {
          buffer,
          byteOffset,
          byteLength
        } = part;
        this.parts.push(new Uint8Array(buffer, byteOffset, byteLength));
        this.size += byteLength;
      } else {
        const bytes = new TextEncoder().encode(String(part));
        this.parts.push(bytes);
        this.size += bytes.byteLength;
      }
    }
    this.type = readType(options.type);
  }
  slice() {
    let start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.size;
    let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    const {
      size,
      parts: parts
    } = this;
    let offset = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let limit = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(limit - offset, 0);
    const blob = new BlobPolyfill([], {
      type
    });
    if (span === 0) {
      return blob;
    }
    let blobSize = 0;
    const blobParts = [];
    for (const part of parts) {
      const {
        byteLength
      } = part;
      if (offset > 0 && byteLength <= offset) {
        offset -= byteLength;
        limit -= byteLength;
      } else {
        const chunk = part.subarray(offset, Math.min(byteLength, limit));
        blobParts.push(chunk);
        blobSize += chunk.byteLength;
        offset = 0;
        if (blobSize >= span) {
          break;
        }
      }
    }
    blob.parts = blobParts;
    blob.size = blobSize;
    return blob;
  }
  async arrayBuffer() {
    return this._toArrayBuffer();
  }
  async text() {
    const decoder = new TextDecoder();
    let text = '';
    for (const part of this.parts) {
      text += decoder.decode(part);
    }
    return text;
  }
  stream() {
    return new BlobStream(this.parts);
  }
  toString() {
    return '[object Blob]';
  }
  get [_Symbol$toStringTag]() {
    return 'Blob';
  }
  _toArrayBuffer() {
    const buffer = new ArrayBuffer(this.size);
    const bytes = new Uint8Array(buffer);
    let offset = 0;
    for (const part of this.parts) {
      bytes.set(part, offset);
      offset += part.byteLength;
    }
    return buffer;
  }
}
function readType() {
  let input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  const type = String(input).toLowerCase();
  return /[^\u0020-\u007E]/.test(type) ? '' : type;
}
//# sourceMappingURL=blob.js.map