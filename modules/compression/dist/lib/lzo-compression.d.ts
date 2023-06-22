import type { CompressionOptions } from './compression';
import { Compression } from './compression';
/**
 * Lempel-Ziv-Oberheimer compression / decompression
 */
export declare class LZOCompression extends Compression {
    readonly name = "lzo";
    readonly extensions: never[];
    readonly contentEncodings: never[];
    readonly isSupported = false;
    readonly options: CompressionOptions;
    /**
     * lzo is an injectable dependency due to big size
     * @param options
     */
    constructor(options: CompressionOptions);
    preload(): Promise<void>;
    compress(input: ArrayBuffer): Promise<ArrayBuffer>;
    decompress(input: ArrayBuffer): Promise<ArrayBuffer>;
}
//# sourceMappingURL=lzo-compression.d.ts.map