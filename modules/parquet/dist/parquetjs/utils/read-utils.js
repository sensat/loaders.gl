"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldIndexOf = exports.getBitWidth = exports.decodePageHeader = exports.decodeFileMetadata = exports.getThriftEnum = exports.decodeThrift = exports.serializeThrift = void 0;
const thrift_1 = require("thrift");
const parquet_thrift_1 = require("../parquet-thrift");
class UFramedTransport extends thrift_1.TFramedTransport {
    constructor() {
        super(...arguments);
        this.readPos = 0;
    }
}
/**
 * Helper function that serializes a thrift object into a buffer
 */
function serializeThrift(obj) {
    const output = [];
    const transport = new thrift_1.TBufferedTransport(undefined, (buf) => {
        output.push(buf);
    });
    const protocol = new thrift_1.TCompactProtocol(transport);
    obj.write(protocol);
    transport.flush();
    return Buffer.concat(output);
}
exports.serializeThrift = serializeThrift;
function decodeThrift(obj, buf, offset) {
    if (!offset) {
        // tslint:disable-next-line:no-parameter-reassignment
        offset = 0;
    }
    const transport = new UFramedTransport(buf);
    transport.readPos = offset;
    const protocol = new thrift_1.TCompactProtocol(transport);
    obj.read(protocol);
    return transport.readPos - offset;
}
exports.decodeThrift = decodeThrift;
/**
 * FIXME not ideal that this is linear
 */
function getThriftEnum(klass, value) {
    for (const k in klass) {
        if (klass[k] === value) {
            return k;
        }
    }
    throw new Error('Invalid ENUM value');
}
exports.getThriftEnum = getThriftEnum;
function decodeFileMetadata(buf, offset) {
    if (!offset) {
        // tslint:disable-next-line:no-parameter-reassignment
        offset = 0;
    }
    const transport = new UFramedTransport(buf);
    transport.readPos = offset;
    const protocol = new thrift_1.TCompactProtocol(transport);
    const metadata = parquet_thrift_1.FileMetaData.read(protocol);
    return { length: transport.readPos - offset, metadata };
}
exports.decodeFileMetadata = decodeFileMetadata;
function decodePageHeader(buf, offset) {
    if (!offset) {
        // tslint:disable-next-line:no-parameter-reassignment
        offset = 0;
    }
    const transport = new UFramedTransport(buf);
    transport.readPos = offset;
    const protocol = new thrift_1.TCompactProtocol(transport);
    const pageHeader = parquet_thrift_1.PageHeader.read(protocol);
    return { length: transport.readPos - offset, pageHeader };
}
exports.decodePageHeader = decodePageHeader;
/**
 * Get the number of bits required to store a given value
 */
function getBitWidth(val) {
    if (val === 0) {
        return 0;
        // tslint:disable-next-line:no-else-after-return
    }
    return Math.ceil(Math.log2(val + 1));
}
exports.getBitWidth = getBitWidth;
// Supports MQTT path wildcards
// + all immediate children
// # all descendents
function fieldIndexOf(arr, elem) {
    for (let j = 0; j < arr.length; j++) {
        if (arr[j].length > elem.length) {
            continue; // eslint-disable-line no-continue
        }
        let m = true;
        for (let i = 0; i < elem.length; i++) {
            if (arr[j][i] === elem[i] || arr[j][i] === '+' || arr[j][i] === '#') {
                continue; // eslint-disable-line no-continue
            }
            if (i >= arr[j].length && arr[j][arr[j].length - 1] === '#') {
                continue; // eslint-disable-line no-continue
            }
            m = false;
            break;
        }
        if (m)
            return j;
    }
    return -1;
}
exports.fieldIndexOf = fieldIndexOf;
