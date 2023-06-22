/**
 * Forked from @gozala's web-blob under MIT license
 * @see https://github.com/Gozala/web-blob
 */
import { ReadableStreamPolyfill } from './readable-stream';
/**
 * Blob stream is a `ReadableStream` extension optimized to have minimal
 * overhead when consumed as `AsyncIterable<Uint8Array>`.
 * extends {ReadableStream<Uint8Array>}
 * implements {AsyncIterable<Uint8Array>}
 */
export declare class BlobStream<T> extends ReadableStreamPolyfill<T> {
    private readonly _chunks;
    /**
     * @param chunks
     */
    constructor(chunks: any);
    /**
     * @property [_options.preventCancel]
     */
    [Symbol.asyncIterator](_options?: {
        preventCancel?: boolean;
    }): AsyncIterable<Uint8Array>;
}
//# sourceMappingURL=blob-stream.d.ts.map