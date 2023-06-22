"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePolyfill = void 0;
// Forked from @gozala's web-file under MIT license https://github.com/Gozala/web-file
const blob_1 = require("./blob");
/**
 * Forked from @gozala's web-file under MIT license
 * @see https://github.com/Gozala/web-file
 */
// @ts-ignore
class FilePolyfill extends blob_1.BlobPolyfill {
    /**
     * @param init
     * @param name - A USVString representing the file name or the path
     * to the file.
     * @param [options]
     */
    constructor(init, name, options = {}) {
        super(init, options);
        // implements File {
        // public API
        /** The name of the file referenced by the File object. */
        this.name = '';
        /** The path the URL of the File is relative to. */
        this.webkitRelativePath = '';
        // Per File API spec https://w3c.github.io/FileAPI/#file-constructor
        // Every "/" character of file name must be replaced with a ":".
        /** @private */
        this.name = String(name).replace(/\//g, ':');
        /** @private */
        this.lastModified = options?.lastModified || Date.now();
    }
    get [Symbol.toStringTag]() {
        return 'File';
    }
}
exports.FilePolyfill = FilePolyfill;
