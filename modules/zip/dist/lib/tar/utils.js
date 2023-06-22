"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToUint8 = exports.pad = exports.clean = void 0;
// This file is derived from the tar-js code base under MIT license
// See https://github.com/beatgammit/tar-js/blob/master/LICENSE
/*
 * tar-js
 * MIT (c) 2011 T. Jameson Little
 */
/**
 * Returns the memory area specified by length
 * @param length
 * @returns {Uint8Array}
 */
function clean(length) {
    let i;
    const buffer = new Uint8Array(length);
    for (i = 0; i < length; i += 1) {
        buffer[i] = 0;
    }
    return buffer;
}
exports.clean = clean;
/**
 * Converting data to a string
 * @param num
 * @param bytes
 * @param base
 * @returns string
 */
function pad(num, bytes, base) {
    const numStr = num.toString(base || 8);
    return '000000000000'.substr(numStr.length + 12 - bytes) + numStr;
}
exports.pad = pad;
/**
 * Converting input to binary data
 * @param input
 * @param out
 * @param offset
 * @returns {Uint8Array}
 */
function stringToUint8(input, out, offset) {
    let i;
    let length;
    out = out || clean(input.length);
    offset = offset || 0;
    for (i = 0, length = input.length; i < length; i += 1) {
        out[offset] = input.charCodeAt(i);
        offset += 1;
    }
    return out;
}
exports.stringToUint8 = stringToUint8;
