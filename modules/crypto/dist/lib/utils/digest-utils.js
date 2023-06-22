"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBase64 = exports.toHex = void 0;
const base64_utils_1 = require("./base64-utils");
/**
 *
 */
function toHex(cipher) {
    const hexString = cipher.toString(16);
    return hexString === '0' ? `0${hexString}` : hexString;
}
exports.toHex = toHex;
/**
 * @see https://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript
 */
function hexToBase64(hexstring) {
    // Add leading zero to keep even count of digits
    // eg. f85d741 => 0f85d741
    if (hexstring.length % 2 !== 0) {
        hexstring = `0${hexstring}`;
    }
    const matches = hexstring.match(/\w{2}/g) || [];
    const string = matches.map((a) => String.fromCharCode(parseInt(a, 16))).join('');
    // TODO - define how to handle failures
    return (0, base64_utils_1.toBase64)(string) || '';
}
exports.hexToBase64 = hexToBase64;
