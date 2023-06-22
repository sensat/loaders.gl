"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHA256Hash = void 0;
//
const crypto_hash_1 = require("./crypto-hash");
/**
 * A transform that calculates Cryptographic Hash
 */
class SHA256Hash extends crypto_hash_1.CryptoHash {
    constructor(options) {
        super({ ...options, crypto: { ...options.crypto, algorithm: 'SHA256' } });
    }
}
exports.SHA256Hash = SHA256Hash;
