"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobStream = void 0;
/**
 * Forked from @gozala's web-blob under MIT license
 * @see https://github.com/Gozala/web-blob
 */
const readable_stream_1 = require("./readable-stream");
const blob_stream_controller_1 = require("./blob-stream-controller");
/**
 * Blob stream is a `ReadableStream` extension optimized to have minimal
 * overhead when consumed as `AsyncIterable<Uint8Array>`.
 * extends {ReadableStream<Uint8Array>}
 * implements {AsyncIterable<Uint8Array>}
 */
// @ts-ignore
class BlobStream extends readable_stream_1.ReadableStreamPolyfill {
    /**
     * @param chunks
     */
    constructor(chunks) {
        // @ts-ignore
        super(new blob_stream_controller_1.BlobStreamController(chunks.values()), { type: 'bytes' });
        /** @private */
        this._chunks = chunks;
    }
    /**
     * @property [_options.preventCancel]
     */
    // @ts-ignore
    async *[Symbol.asyncIterator](_options) {
        const reader = this.getReader();
        yield* this._chunks;
        reader.releaseLock();
    }
}
exports.BlobStream = BlobStream;
