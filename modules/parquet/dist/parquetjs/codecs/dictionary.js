"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeValues = exports.decodeValues = void 0;
const rle_1 = require("./rle");
function decodeValues(type, cursor, count, opts) {
    opts.bitWidth = cursor.buffer.slice(cursor.offset, cursor.offset + 1).readInt8(0);
    cursor.offset += 1;
    return (0, rle_1.decodeValues)(type, cursor, count, { ...opts, disableEnvelope: true });
}
exports.decodeValues = decodeValues;
function encodeValues(type, cursor, count, opts) {
    throw new Error('Encode dictionary functionality is not supported');
}
exports.encodeValues = encodeValues;
