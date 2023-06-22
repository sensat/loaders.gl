"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
// Hash
const loader_utils_1 = require("@loaders.gl/loader-utils");
/** Abstract hash base class */
class Hash {
    constructor(options = {}) {
        this.hashBatches = this.hashBatches.bind(this);
    }
    async preload() {
        return;
    }
    async *hashBatches(asyncIterator) {
        const arrayBuffers = [];
        for await (const arrayBuffer of asyncIterator) {
            arrayBuffers.push(arrayBuffer);
            yield arrayBuffer;
        }
        const output = await this.concatenate(arrayBuffers);
        const hash = await this.hash(output);
        this.options.crypto?.onEnd?.({ hash });
    }
    // HELPERS
    async concatenate(asyncIterator) {
        return await (0, loader_utils_1.concatenateArrayBuffersAsync)(asyncIterator);
    }
}
exports.Hash = Hash;
