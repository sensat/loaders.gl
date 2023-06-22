"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MD5Hash = void 0;
// Fork of https://github.com/briantbutton/md5-wasm under MIT license
const hash_1 = require("./hash");
const md5_wasm_1 = __importDefault(require("./algorithms/md5-wasm"));
const digest_utils_1 = require("./utils/digest-utils");
/**
 * A transform that calculates MD5 hashes, passing data through
 */
class MD5Hash extends hash_1.Hash {
    constructor(options = {}) {
        super();
        this.name = 'md5';
        this.options = options;
    }
    /**
     * Atomic hash calculation
     * @returns base64 encoded hash
     */
    async hash(input) {
        const md5Promise = new Promise((resolve, reject) => 
        // @ts-expect-error
        (0, md5_wasm_1.default)(input).then(resolve).catch(reject));
        const hex = await md5Promise;
        return (0, digest_utils_1.hexToBase64)(hex);
    }
}
exports.MD5Hash = MD5Hash;
