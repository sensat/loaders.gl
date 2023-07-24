"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataViewFileProvider = void 0;
/**
 * Provides file data using DataView
 */
class DataViewFileProvider {
    constructor(file) {
        this.file = file;
    }
    /**
     * Gets an unsigned 8-bit integer at the specified byte offset from the start of the file.
     * @param offset The offset, in bytes, from the start of the file where to read the data.
     */
    getUint8(offset) {
        return Promise.resolve(this.file.getUint8(offset));
    }
    /**
     * Gets an unsigned 16-bit integer at the specified byte offset from the start of the file.
     * @param offset The offset, in bytes, from the start of the file where to read the data.
     */
    getUint16(offset) {
        return Promise.resolve(this.file.getUint16(offset, true));
    }
    /**
     * Gets an unsigned 32-bit integer at the specified byte offset from the start of the file.
     * @param offset The offset, in bytes, from the start of the file where to read the data.
     */
    getUint32(offset) {
        return Promise.resolve(this.file.getUint32(offset, true));
    }
    /**
     * returns an ArrayBuffer whose contents are a copy of this file bytes from startOffset, inclusive, up to endOffset, exclusive.
     * @param startOffset The offset, in bytes, from the start of the file where to start reading the data.
     * @param endOffset The offset, in bytes, from the start of the file where to end reading the data.
     */
    slice(startOffset, endOffset) {
        return Promise.resolve(this.file.buffer.slice(startOffset, endOffset));
    }
    /**
     * the length (in bytes) of the data.
     */
    get length() {
        return this.file.byteLength;
    }
}
exports.DataViewFileProvider = DataViewFileProvider;
