"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandleProvider = void 0;
const fs_1 = require("fs");
/**
 * Provides file data using node fs library
 */
class FileHandleProvider {
    /**
     * Returns a new copy of FileHandleProvider
     * @param path The path to the file in file system
     */
    static async from(path) {
        const fileDescriptor = await fs_1.promises.open(path);
        return new FileHandleProvider(fileDescriptor, (await fileDescriptor.stat()).size);
    }
    constructor(fileDescriptor, size) {
        this.fileDescriptor = fileDescriptor;
        this.size = size;
    }
    /**
     * Gets an unsigned 8-bit integer (unsigned byte) at the specified byte offset from the start of the file.
     * @param offset The offset, in bytes, from the start of the file where to read the data.
     */
    async getUint8(offset) {
        const val = new Uint8Array((await this.fileDescriptor.read(Buffer.alloc(1), 0, 1, offset)).buffer.buffer).at(0);
        if (val === undefined) {
            throw new Error('something went wrong');
        }
        return val;
    }
    /**
     * Gets an unsigned 16-bit integer (unsigned byte) at the specified byte offset from the start of the file.
     * @param offset The offset, in bytes, from the start of the file where to read the data.
     */
    async getUint16(offset) {
        const val = new Uint16Array((await this.fileDescriptor.read(Buffer.alloc(2), 0, 2, offset)).buffer.buffer).at(0);
        if (val === undefined) {
            throw new Error('something went wrong');
        }
        return val;
    }
    /**
     * Gets an unsigned 32-bit integer (unsigned byte) at the specified byte offset from the start of the file.
     * @param offset The offset, in bytes, from the start of the file where to read the data.
     */
    async getUint32(offset) {
        const val = new Uint32Array((await this.fileDescriptor.read(Buffer.alloc(4), 0, 4, offset)).buffer.buffer).at(0);
        if (val === undefined) {
            throw new Error('something went wrong');
        }
        return val;
    }
    /**
     * returns an ArrayBuffer whose contents are a copy of this file bytes from startOffset, inclusive, up to endOffset, exclusive.
     * @param startOffset The offset, in bytes, from the start of the file where to start reading the data.
     * @param endOffset The offset, in bytes, from the start of the file where to end reading the data.
     */
    async slice(startOffset, endOffset) {
        const length = endOffset - startOffset;
        return (await this.fileDescriptor.read(Buffer.alloc(length), 0, length, startOffset)).buffer
            .buffer;
    }
    /**
     * the length (in bytes) of the data.
     */
    get length() {
        return this.size;
    }
}
exports.FileHandleProvider = FileHandleProvider;
