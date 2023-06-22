"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const assert_1 = require("../../utils/assert");
const stream_utils_node_1 = require("./utils/stream-utils.node");
const headers_node_1 = require("./headers.node");
const isBoolean = (x) => typeof x === 'boolean';
const isFunction = (x) => typeof x === 'function';
const isObject = (x) => x !== null && typeof x === 'object';
const isReadableNodeStream = (x) => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
/**
 * Polyfill for Browser Response
 *
 * Under Node.js we return a mock "fetch response object"
 * so that apps can use the same API as in the browser.
 *
 * Note: This is intended to be a "lightweight" implementation and will have limitations.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
const stream_1 = require("stream");
class Response {
    // TODO - handle ArrayBuffer, ArrayBufferView, Buffer
    constructor(body, options) {
        this.bodyUsed = false;
        const { headers, status = 200, statusText = 'OK', url } = options || {};
        this.url = url;
        this.ok = status === 200;
        this.status = status; // TODO - handle errors and set status
        this.statusText = statusText;
        this.headers = new headers_node_1.Headers(options?.headers || {});
        // Check for content-encoding and create a decompression stream
        if (isReadableNodeStream(body)) {
            this._body = (0, stream_utils_node_1.decompressReadStream)(body, headers);
        }
        else if (typeof body === 'string') {
            this._body = stream_1.Readable.from([new TextEncoder().encode(body)]);
        }
        else {
            this._body = stream_1.Readable.from([body || new ArrayBuffer(0)]);
        }
    }
    // Subset of Properties
    // Returns a readable stream to the "body" of the response (or file)
    get body() {
        (0, assert_1.assert)(!this.bodyUsed);
        (0, assert_1.assert)(isReadableNodeStream(this._body)); // Not implemented: conversion of ArrayBuffer etc to stream
        this.bodyUsed = true;
        return this._body;
    }
    // Subset of Methods
    async arrayBuffer() {
        if (!isReadableNodeStream(this._body)) {
            return this._body || new ArrayBuffer(0);
        }
        const data = await (0, stream_utils_node_1.concatenateReadStream)(this._body);
        return data;
    }
    async text() {
        const arrayBuffer = await this.arrayBuffer();
        const textDecoder = new TextDecoder();
        return textDecoder.decode(arrayBuffer);
    }
    async json() {
        const text = await this.text();
        return JSON.parse(text);
    }
    async blob() {
        if (typeof Blob === 'undefined') {
            throw new Error('Blob polyfill not installed');
        }
        return new Blob([await this.arrayBuffer()]);
    }
}
exports.Response = Response;
