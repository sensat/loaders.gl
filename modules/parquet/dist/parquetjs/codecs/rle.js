"use strict";
// Forked from https://github.com/kbajalc/parquets under MIT license (Copyright (c) 2017 ironSource Ltd.)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeValues = exports.encodeValues = void 0;
const varint_1 = __importDefault(require("varint"));
// eslint-disable-next-line max-statements, complexity
function encodeValues(type, values, opts) {
    if (!('bitWidth' in opts)) {
        throw new Error('bitWidth is required');
    }
    switch (type) {
        case 'BOOLEAN':
        case 'INT32':
        case 'INT64':
            // tslint:disable-next-line:no-parameter-reassignment
            values = values.map((x) => parseInt(x, 10));
            break;
        default:
            throw new Error(`unsupported type: ${type}`);
    }
    let buf = Buffer.alloc(0);
    let run = [];
    let repeats = 0;
    for (let i = 0; i < values.length; i++) {
        // If we are at the beginning of a run and the next value is same we start
        // collecting repeated values
        if (repeats === 0 && run.length % 8 === 0 && values[i] === values[i + 1]) {
            // If we have any data in runs we need to encode them
            if (run.length) {
                buf = Buffer.concat([buf, encodeRunBitpacked(run, opts)]);
                run = [];
            }
            repeats = 1;
        }
        else if (repeats > 0 && values[i] === values[i - 1]) {
            repeats += 1;
        }
        else {
            // If values changes we need to post any previous repeated values
            if (repeats) {
                buf = Buffer.concat([buf, encodeRunRepeated(values[i - 1], repeats, opts)]);
                repeats = 0;
            }
            run.push(values[i]);
        }
    }
    if (repeats) {
        buf = Buffer.concat([buf, encodeRunRepeated(values[values.length - 1], repeats, opts)]);
    }
    else if (run.length) {
        buf = Buffer.concat([buf, encodeRunBitpacked(run, opts)]);
    }
    if (opts.disableEnvelope) {
        return buf;
    }
    const envelope = Buffer.alloc(buf.length + 4);
    envelope.writeUInt32LE(buf.length, undefined);
    buf.copy(envelope, 4);
    return envelope;
}
exports.encodeValues = encodeValues;
function decodeValues(type, cursor, count, opts) {
    if (!('bitWidth' in opts)) {
        throw new Error('bitWidth is required');
    }
    if (!opts.disableEnvelope) {
        cursor.offset += 4;
    }
    let values = [];
    while (values.length < count) {
        const header = varint_1.default.decode(cursor.buffer, cursor.offset);
        cursor.offset += varint_1.default.encodingLength(header);
        if (header & 1) {
            const count = (header >> 1) * 8;
            values.push(...decodeRunBitpacked(cursor, count, opts));
        }
        else {
            const count = header >> 1;
            values.push(...decodeRunRepeated(cursor, count, opts));
        }
    }
    values = values.slice(0, count);
    if (values.length !== count) {
        throw new Error('invalid RLE encoding');
    }
    return values;
}
exports.decodeValues = decodeValues;
function decodeRunBitpacked(cursor, count, opts) {
    // @ts-ignore
    const bitWidth = opts.bitWidth;
    if (count % 8 !== 0) {
        throw new Error('must be a multiple of 8');
    }
    // tslint:disable-next-line:prefer-array-literal
    const values = new Array(count).fill(0);
    for (let b = 0; b < bitWidth * count; b++) {
        if (cursor.buffer[cursor.offset + Math.floor(b / 8)] & (1 << b % 8)) {
            values[Math.floor(b / bitWidth)] |= 1 << b % bitWidth;
        }
    }
    cursor.offset += bitWidth * (count / 8);
    return values;
}
function decodeRunRepeated(cursor, count, opts) {
    // @ts-ignore
    const bitWidth = opts.bitWidth;
    let value = 0;
    for (let i = 0; i < Math.ceil(bitWidth / 8); i++) {
        // eslint-disable-next-line
        value << 8; //  TODO - this looks wrong
        value += cursor.buffer[cursor.offset];
        cursor.offset += 1;
    }
    // tslint:disable-next-line:prefer-array-literal
    return new Array(count).fill(value);
}
function encodeRunBitpacked(values, opts) {
    // @ts-ignore
    const bitWidth = opts.bitWidth;
    for (let i = 0; i < values.length % 8; i++) {
        values.push(0);
    }
    const buf = Buffer.alloc(Math.ceil(bitWidth * (values.length / 8)));
    for (let b = 0; b < bitWidth * values.length; b++) {
        if ((values[Math.floor(b / bitWidth)] & (1 << b % bitWidth)) > 0) {
            buf[Math.floor(b / 8)] |= 1 << b % 8;
        }
    }
    return Buffer.concat([Buffer.from(varint_1.default.encode(((values.length / 8) << 1) | 1)), buf]);
}
function encodeRunRepeated(value, count, opts) {
    // @ts-ignore
    const bitWidth = opts.bitWidth;
    const buf = Buffer.alloc(Math.ceil(bitWidth / 8));
    for (let i = 0; i < buf.length; i++) {
        buf.writeUInt8(value & 0xff, i);
        // eslint-disable-next-line
        value >> 8; //  TODO - this looks wrong
    }
    return Buffer.concat([Buffer.from(varint_1.default.encode(count << 1)), buf]);
}
