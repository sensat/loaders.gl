import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export class DataViewFileProvider {
  constructor(file) {
    _defineProperty(this, "file", void 0);
    this.file = file;
  }
  getUint8(offset) {
    return Promise.resolve(this.file.getUint8(offset));
  }
  getUint16(offset) {
    return Promise.resolve(this.file.getUint16(offset, true));
  }
  getUint32(offset) {
    return Promise.resolve(this.file.getUint32(offset, true));
  }
  slice(startOffset, endOffset) {
    return Promise.resolve(this.file.buffer.slice(startOffset, endOffset));
  }
  get length() {
    return this.file.byteLength;
  }
}
//# sourceMappingURL=buffer-file-provider.js.map