import { Hash } from './hash';
type CryptoHashOptions = {
    modules: {
        [moduleName: string]: any;
    };
    crypto: {
        algorithm: string;
        onEnd?: (result: {
            hash: string;
        }) => any;
    };
};
/**
 * A transform that calculates Cryptographic Hash using Crypto JS library
 * @deprecated Warning, experimental class
 */
export declare class CryptoHash extends Hash {
    readonly name: any;
    options: CryptoHashOptions;
    private _algorithm;
    private _hash;
    constructor(options: CryptoHashOptions);
    preload(): Promise<void>;
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    hash(input: ArrayBuffer): Promise<string>;
    hashBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>): AsyncIterable<ArrayBuffer>;
}
export {};
//# sourceMappingURL=crypto-hash.d.ts.map