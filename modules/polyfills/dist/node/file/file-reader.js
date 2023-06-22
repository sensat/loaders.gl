"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileReaderPolyfill = void 0;
const btoa_node_1 = require("../buffer/btoa.node");
class FileReaderPolyfill {
    constructor() {
        this.onload = null;
    }
    abort() {
        return;
    }
    async readAsArrayBuffer(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        if (this.onload) {
            this.onload({ target: { result: arrayBuffer } });
        }
    }
    async readAsBinaryString(blob) {
        throw Error('Not implemented');
    }
    async readAsDataURL(blob) {
        const text = await blob.text();
        const dataUrl = `data://;base64,${(0, btoa_node_1.atob)(text)}`;
        if (this.onload) {
            this.onload({ target: { result: dataUrl } });
        }
    }
    async readAsText(blob) {
        const text = await blob.text();
        if (this.onload) {
            this.onload({ target: { result: text } });
        }
    }
}
exports.FileReaderPolyfill = FileReaderPolyfill;
