import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export class Utf8ArrayBufferEncoder {
  constructor(chunkSize) {
    _defineProperty(this, "chunkSize", void 0);
    _defineProperty(this, "strings", []);
    _defineProperty(this, "totalLength", 0);
    _defineProperty(this, "textEncoder", new TextEncoder());
    this.chunkSize = chunkSize;
  }
  push() {
    for (var _len = arguments.length, strings = new Array(_len), _key = 0; _key < _len; _key++) {
      strings[_key] = arguments[_key];
    }
    for (const string of strings) {
      this.strings.push(string);
      this.totalLength += string.length;
    }
  }
  isFull() {
    return this.totalLength >= this.chunkSize;
  }
  getArrayBufferBatch() {
    return this.textEncoder.encode(this.getStringBatch()).buffer;
  }
  getStringBatch() {
    const stringChunk = this.strings.join('');
    this.strings = [];
    this.totalLength = 0;
    return stringChunk;
  }
}
//# sourceMappingURL=utf8-encoder.js.map