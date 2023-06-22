import { BlobStream } from './blob-stream';
/**
 * Forked from @gozala's web-blob under MIT license
 * @see https://github.com/Gozala/web-blob
 */
export declare class BlobPolyfill {
    /** The MIME type of the data contained in the Blob. If type is unknown, string is empty. */
    readonly type: string;
    /** The size, in bytes, of the data contained in the Blob object. */
    size: number;
    private parts;
    /**
     * @param [init]
     * @param [options]
     */
    constructor(init?: BlobPart[], options?: BlobPropertyBag);
    /**
     * Returns a new Blob object containing the data in the specified range of
     * bytes of the blob on which it's called.
     * @param start=0 - An index into the Blob indicating the first
     * byte to include in the new Blob. If you specify a negative value, it's
     * treated as an offset from the end of the Blob toward the beginning. For
     * example, `-10` would be the 10th from last byte in the Blob. The default
     * value is `0`. If you specify a value for start that is larger than the
     * size of the source Blob, the returned Blob has size 0 and contains no
     * data.
     * @param end - An index into the `Blob` indicating the first byte
     *  that will *not* be included in the new `Blob` (i.e. the byte exactly at
     * this index is not included). If you specify a negative value, it's treated
     * as an offset from the end of the Blob toward the beginning. For example,
     * `-10` would be the 10th from last byte in the `Blob`. The default value is
     * size.
     * @param type - The content type to assign to the new Blob;
     * this will be the value of its type property. The default value is an empty
     * string.
     */
    slice(start?: number, end?: number, type?: string): Blob;
    /**
     * Returns a promise that resolves with an ArrayBuffer containing the entire
     * contents of the Blob as binary data.
     */
    arrayBuffer(): Promise<ArrayBuffer>;
    /**
     * Returns a promise that resolves with a USVString containing the entire
     * contents of the Blob interpreted as UTF-8 text.
     */
    text(): Promise<string>;
    /**
     */
    stream(): BlobStream<any>;
    /**
     * @returns {string}
     */
    toString(): string;
    get [Symbol.toStringTag](): string;
    _toArrayBuffer(): ArrayBuffer;
}
//# sourceMappingURL=blob.d.ts.map