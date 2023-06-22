import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { assert } from '../../utils/assert';
import { decompressReadStream, concatenateReadStream } from './utils/stream-utils.node';
import { Headers } from './headers.node';
const isBoolean = x => typeof x === 'boolean';
const isFunction = x => typeof x === 'function';
const isObject = x => x !== null && typeof x === 'object';
const isReadableNodeStream = x => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
import { Readable } from 'stream';
export class Response {
  constructor(body, options) {
    _defineProperty(this, "ok", void 0);
    _defineProperty(this, "status", void 0);
    _defineProperty(this, "statusText", void 0);
    _defineProperty(this, "headers", void 0);
    _defineProperty(this, "url", void 0);
    _defineProperty(this, "bodyUsed", false);
    _defineProperty(this, "_body", void 0);
    const {
      headers,
      status = 200,
      statusText = 'OK',
      url
    } = options || {};
    this.url = url;
    this.ok = status === 200;
    this.status = status;
    this.statusText = statusText;
    this.headers = new Headers((options === null || options === void 0 ? void 0 : options.headers) || {});
    if (isReadableNodeStream(body)) {
      this._body = decompressReadStream(body, headers);
    } else if (typeof body === 'string') {
      this._body = Readable.from([new TextEncoder().encode(body)]);
    } else {
      this._body = Readable.from([body || new ArrayBuffer(0)]);
    }
  }
  get body() {
    assert(!this.bodyUsed);
    assert(isReadableNodeStream(this._body));
    this.bodyUsed = true;
    return this._body;
  }
  async arrayBuffer() {
    if (!isReadableNodeStream(this._body)) {
      return this._body || new ArrayBuffer(0);
    }
    const data = await concatenateReadStream(this._body);
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
//# sourceMappingURL=response.node.js.map