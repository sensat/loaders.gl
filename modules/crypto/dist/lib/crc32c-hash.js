"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRC32CHash = void 0;
// CRC32c
const hash_1 = require("./hash");
const crc32c_1 = __importDefault(require("./algorithms/crc32c"));
const digest_utils_1 = require("./utils/digest-utils");
/**
 * A transform that calculates CRC32c Hash
 */
class CRC32CHash extends hash_1.Hash {
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    constructor(options = {}) {
        super();
        this.name = 'crc32c';
        this.options = { crypto: {}, ...options };
        this._hash = new crc32c_1.default(options);
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
    // runInBatches inherited
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
exports.CRC32CHash = CRC32CHash;
