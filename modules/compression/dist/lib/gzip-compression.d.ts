import type { CompressionOptions } from './compression';
import { DeflateCompression } from './deflate-compression';
import pako from 'pako';
export type GZipCompressionOptions = CompressionOptions & {
    gzip?: pako.InflateOptions & pako.DeflateOptions;
};
/**
 * GZIP compression / decompression
 */
export declare class GZipCompression extends DeflateCompression {
    readonly name: string;
    readonly extensions: string[];
    readonly contentEncodings: string[];
    readonly isSupported = true;
    constructor(options?: GZipCompressionOptions);
}
//# sourceMappingURL=gzip-compression.d.ts.map