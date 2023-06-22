import { Hash } from './hash';
/**
 * A transform that calculates CRC32c Hash
 */
export declare class CRC32CHash extends Hash {
    readonly name = "crc32c";
    options: any;
    private _hash;
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    constructor(options?: {});
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    hash(input: ArrayBuffer): Promise<string>;
    hashSync(input: ArrayBuffer): string;
    hashBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>): AsyncIterable<ArrayBuffer>;
}
//# sourceMappingURL=crc32c-hash.d.ts.map