export { CRC32Hash } from './lib/crc32-hash';
export { CRC32CHash } from './lib/crc32c-hash';
export { MD5Hash } from './lib/md5-hash';
export { SHA256Hash } from './lib/sha256-hash';
export { CryptoHash } from './lib/crypto-hash';
export { NodeHash } from './lib/node-hash';
export { hexToBase64 as _hexToBase64, toHex as _toHex } from './lib/utils/digest-utils';
/**
 * Small, fast worker for CRC32, CRC32c and MD5 Hashes
 */
export declare const CryptoWorker: {
    id: string;
    name: string;
    module: string;
    version: any;
    options: {
        crypto: {};
    };
};
/**
 * Large worker for full complement of Cryptographic Hashes
 * bundles the full crypto.js library
 */
export declare const CryptoJSWorker: {
    id: string;
    name: string;
    module: string;
    version: any;
    options: {
        cryptojs: {};
    };
};
//# sourceMappingURL=index.d.ts.map