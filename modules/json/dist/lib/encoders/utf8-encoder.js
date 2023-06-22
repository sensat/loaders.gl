"use strict";
// loaders.gl, MIT License
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utf8ArrayBufferEncoder = void 0;
/* global TextEncoder */
class Utf8ArrayBufferEncoder {
    constructor(chunkSize) {
        this.strings = [];
        this.totalLength = 0;
        this.textEncoder = new TextEncoder();
        this.chunkSize = chunkSize;
    }
    push(...strings) {
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
exports.Utf8ArrayBufferEncoder = Utf8ArrayBufferEncoder;
