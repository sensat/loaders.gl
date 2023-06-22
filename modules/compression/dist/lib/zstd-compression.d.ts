import type { CompressionOptions } from './compression';
import { Compression } from './compression';
/**
 * Zstandard compression / decompression
 */
export declare class ZstdCompression extends Compression {
    readonly name: string;
    readonly extensions: never[];
    readonly contentEncodings: never[];
    readonly isSupported = true;
    readonly options: CompressionOptions;
    /**
     * zstd-codec is an injectable dependency due to big size
     * @param options
     */
    constructor(options: CompressionOptions);
    preload(): Promise<void>;
    compressSync(input: ArrayBuffer): ArrayBuffer;
    decompressSync(input: ArrayBuffer): ArrayBuffer;
}
//# sourceMappingURL=zstd-compression.d.ts.map