"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHash = void 0;
// This dependency is too big, application must provide it
const hash_1 = require("./hash");
const crypto_1 = require("crypto"); // Node.js builtin
/**
 * Calculates Cryptographic Hash using Node.js crypto library
 * @deprecated Warning, experimental class
 */
class NodeHash extends hash_1.Hash {
    constructor(options) {
        super();
        this.name = 'crypto-node';
        this.options = options;
        if (!this.options?.crypto?.algorithm) {
            throw new Error(this.name);
        }
    }
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    async hash(input) {
        await this.preload();
        const hash = (0, crypto_1.createHash)(this.options?.crypto?.algorithm?.toLowerCase());
        const inputArray = new Uint8Array(input);
        return hash.update(inputArray).digest('base64');
    }
    async *hashBatches(asyncIterator) {
        await this.preload();
        const hash = (0, crypto_1.createHash)(this.options?.crypto?.algorithm?.toLowerCase());
        for await (const chunk of asyncIterator) {
            // https://stackoverflow.com/questions/25567468/how-to-decrypt-an-arraybuffer
            const inputArray = new Uint8Array(chunk);
            hash.update(inputArray);
            yield chunk;
        }
        this.options?.crypto?.onEnd?.({ hash: hash.digest('base64') });
    }
}
exports.NodeHash = NodeHash;
