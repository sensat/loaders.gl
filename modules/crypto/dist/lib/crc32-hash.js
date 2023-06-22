"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRC32Hash = void 0;
// CRC32
const hash_1 = require("./hash");
const crc32_1 = __importDefault(require("./algorithms/crc32"));
const digest_utils_1 = require("./utils/digest-utils");
/**
 * Calculates CRC32 Cryptographic Hash
 */
class CRC32Hash extends hash_1.Hash {
    constructor(options = {}) {
        super();
        this.name = 'crc32';
        this.options = { crypto: {}, ...options };
        this._hash = new crc32_1.default();
        this.hashBatches = this.hashBatches.bind(this);
    }
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    async hash(input) {
        return this.hashSync(input);
    }
    hashSync(input) {
        this._hash.update(input);
        const hashValue = this._hash.finalize();
        const hex = (0, digest_utils_1.toHex)(hashValue);
        const hash = (0, digest_utils_1.hexToBase64)(hex);
        return hash;
    }
    async *hashBatches(asyncIterator) {
        for await (const chunk of asyncIterator) {
            this._hash.update(chunk);
            yield chunk;
        }
        const hashValue = this._hash.finalize();
        const hex = (0, digest_utils_1.toHex)(hashValue);
        const hash = (0, digest_utils_1.hexToBase64)(hex);
        this.options.crypto?.onEnd?.({ hash });
    }
}
exports.CRC32Hash = CRC32Hash;
