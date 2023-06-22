import { Hash } from './hash';
type CryptoHashOptions = {
    crypto: {
        algorithm: string;
        onEnd?: (result: {
            hash: string;
        }) => any;
    };
};
/**
 * Calculates Cryptographic Hash using Node.js crypto library
 * @deprecated Warning, experimental class
 */
export declare class NodeHash extends Hash {
    readonly name = "crypto-node";
    options: CryptoHashOptions;
    private _algorithm;
    private _hash;
    constructor(options: CryptoHashOptions);
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    hash(input: ArrayBuffer): Promise<string>;
    hashBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>): AsyncIterable<ArrayBuffer>;
}
export {};
//# sourceMappingURL=node-hash.d.ts.map