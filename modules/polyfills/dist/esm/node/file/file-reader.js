import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { atob } from '../buffer/btoa.node';
export class FileReaderPolyfill {
  constructor() {
    _defineProperty(this, "onload", void 0);
    _defineProperty(this, "onabort", void 0);
    _defineProperty(this, "onerror", void 0);
    _defineProperty(this, "error", void 0);
    _defineProperty(this, "onloadstart", void 0);
    _defineProperty(this, "onloadend", void 0);
    _defineProperty(this, "onprogress", void 0);
    _defineProperty(this, "readyState", void 0);
    _defineProperty(this, "result", void 0);
    _defineProperty(this, "DONE", void 0);
    _defineProperty(this, "EMPTY", void 0);
    _defineProperty(this, "LOADING", void 0);
    _defineProperty(this, "addEventListener", void 0);
    _defineProperty(this, "removeEventListener", void 0);
    _defineProperty(this, "dispatchEvent", void 0);
    this.onload = null;
  }
  abort() {
    return;
  }
  async readAsArrayBuffer(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    if (this.onload) {
      this.onload({
        target: {
          result: arrayBuffer
        }
      });
    }
  }
  async readAsBinaryString(blob) {
    throw Error('Not implemented');
  }
  async readAsDataURL(blob) {
    const text = await blob.text();
    const dataUrl = "data://;base64,".concat(atob(text));
    if (this.onload) {
      this.onload({
        target: {
          result: dataUrl
        }
      });
    }
  }
  async readAsText(blob) {
    const text = await blob.text();
    if (this.onload) {
      this.onload({
        target: {
          result: text
        }
      });
    }
  }
}
//# sourceMappingURL=file-reader.js.map