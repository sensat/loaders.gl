"use strict";
// Based on binary-gltf-utils under MIT license: Copyright (c) 2016-17 Karl Cheng
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArrayBuffer = exports.decodeDataUri = void 0;
const isArrayBuffer = (x) => x && x instanceof ArrayBuffer;
const isBuffer = (x) => x && x instanceof Buffer;
/**
 * Parses a data URI into a buffer, as well as retrieving its declared MIME type.
 *
 * @param {string} uri - a data URI (assumed to be valid)
 * @returns {Object} { buffer, mimeType }
 */
function decodeDataUri(uri) {
    const dataIndex = uri.indexOf(',');
    let buffer;
    let mimeType;
    if (uri.slice(dataIndex - 7, dataIndex) === ';base64') {
        buffer = Buffer.from(uri.slice(dataIndex + 1), 'base64');
        mimeType = uri.slice(5, dataIndex - 7).trim();
    }
    else {
        buffer = Buffer.from(decodeURIComponent(uri.slice(dataIndex + 1)));
        mimeType = uri.slice(5, dataIndex).trim();
    }
    if (!mimeType) {
        mimeType = 'text/plain;charset=US-ASCII';
    }
    else if (mimeType.startsWith(';')) {
        mimeType = `text/plain${mimeType}`;
    }
    return { arrayBuffer: toArrayBuffer(buffer), mimeType };
}
exports.decodeDataUri = decodeDataUri;
/**
 * @param data
 * @todo Duplicate of core
 */
function toArrayBuffer(data) {
    if (isArrayBuffer(data)) {
        return data;
    }
    // TODO - per docs we should just be able to call buffer.buffer, but there are issues
    if (isBuffer(data)) {
        // @ts-expect-error
        const typedArray = new Uint8Array(data);
        return typedArray.buffer;
    }
    // Careful - Node Buffers will look like ArrayBuffers (keep after isBuffer)
    if (ArrayBuffer.isView(data)) {
        return data.buffer;
    }
    if (typeof data === 'string') {
        const text = data;
        const uint8Array = new TextEncoder().encode(text);
        return uint8Array.buffer;
    }
    // HACK to support Blob polyfill
    // @ts-expect-error
    if (data && typeof data === 'object' && data._toArrayBuffer) {
        // @ts-expect-error
        return data._toArrayBuffer();
    }
    throw new Error(`toArrayBuffer(${JSON.stringify(data, null, 2).slice(10)})`);
}
exports.toArrayBuffer = toArrayBuffer;
