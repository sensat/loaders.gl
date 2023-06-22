import { BlobPolyfill } from './blob';
/**
 * Forked from @gozala's web-file under MIT license
 * @see https://github.com/Gozala/web-file
 */
export declare class FilePolyfill extends BlobPolyfill {
    /** The name of the file referenced by the File object. */
    name: string;
    /** The path the URL of the File is relative to. */
    webkitRelativePath: string;
    /**
     * Returns the last modified time of the file, in millisecond since the UNIX
     * epoch (January 1st, 1970 at Midnight).
     */
    lastModified: number;
    /**
     * @param init
     * @param name - A USVString representing the file name or the path
     * to the file.
     * @param [options]
     */
    constructor(init: BlobPart[], name: string, options?: FilePropertyBag);
    get [Symbol.toStringTag](): string;
}
//# sourceMappingURL=file.d.ts.map