import { Hash } from './hash';
/**
 * A transform that calculates MD5 hashes, passing data through
 */
export declare class MD5Hash extends Hash {
    readonly name = "md5";
    readonly options: any;
    constructor(options?: {});
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    hash(input: ArrayBuffer): Promise<string>;
}
//# sourceMappingURL=md5-hash.d.ts.map