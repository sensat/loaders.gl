import { Hash } from './hash';
/**
 * Calculates CRC32 Cryptographic Hash
 */
export declare class CRC32Hash extends Hash {
    readonly name = "crc32";
    options: any;
    private _hash;
    constructor(options?: {});
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    hash(input: ArrayBuffer): Promise<string>;
    hashSync(input: ArrayBuffer): string;
    hashBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>): AsyncIterable<ArrayBuffer>;
}
//# sourceMappingURL=crc32-hash.d.ts.map