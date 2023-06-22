import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Compression } from './compression';
import { isBrowser, toArrayBuffer } from '@loaders.gl/loader-utils';
import pako from 'pako';
import zlib from 'zlib';
import { promisify1 } from '@loaders.gl/loader-utils';
export class DeflateCompression extends Compression {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(options);
    _defineProperty(this, "name", 'deflate');
    _defineProperty(this, "extensions", []);
    _defineProperty(this, "contentEncodings", ['deflate']);
    _defineProperty(this, "isSupported", true);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "_chunks", []);
    this.options = options;
  }
  async compress(input) {
    var _this$options$deflate;
    if (!isBrowser && (_this$options$deflate = this.options.deflate) !== null && _this$options$deflate !== void 0 && _this$options$deflate.useZlib) {
      var _this$options$deflate2;
      const buffer = (_this$options$deflate2 = this.options.deflate) !== null && _this$options$deflate2 !== void 0 && _this$options$deflate2.gzip ? await promisify1(zlib.gzip)(input) : await promisify1(zlib.deflate)(input);
      return toArrayBuffer(buffer);
    }
    return this.compressSync(input);
  }
  async decompress(input) {
    var _this$options$deflate3;
    if (!isBrowser && (_this$options$deflate3 = this.options.deflate) !== null && _this$options$deflate3 !== void 0 && _this$options$deflate3.useZlib) {
      var _this$options$deflate4;
      const buffer = (_this$options$deflate4 = this.options.deflate) !== null && _this$options$deflate4 !== void 0 && _this$options$deflate4.gzip ? await promisify1(zlib.gunzip)(input) : await promisify1(zlib.inflate)(input);
      return toArrayBuffer(buffer);
    }
    return this.decompressSync(input);
  }
  compressSync(input) {
    var _this$options$deflate5, _this$options;
    if (!isBrowser && (_this$options$deflate5 = this.options.deflate) !== null && _this$options$deflate5 !== void 0 && _this$options$deflate5.useZlib) {
      var _this$options$deflate6;
      const buffer = (_this$options$deflate6 = this.options.deflate) !== null && _this$options$deflate6 !== void 0 && _this$options$deflate6.gzip ? zlib.gzipSync(input) : zlib.deflateSync(input);
      return toArrayBuffer(buffer);
    }
    const pakoOptions = ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.deflate) || {};
    const inputArray = new Uint8Array(input);
    return pako.deflate(inputArray, pakoOptions).buffer;
  }
  decompressSync(input) {
    var _this$options$deflate7, _this$options2;
    if (!isBrowser && (_this$options$deflate7 = this.options.deflate) !== null && _this$options$deflate7 !== void 0 && _this$options$deflate7.useZlib) {
      var _this$options$deflate8;
      const buffer = (_this$options$deflate8 = this.options.deflate) !== null && _this$options$deflate8 !== void 0 && _this$options$deflate8.gzip ? zlib.gunzipSync(input) : zlib.inflateSync(input);
      return toArrayBuffer(buffer);
    }
    const pakoOptions = ((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.deflate) || {};
    const inputArray = new Uint8Array(input);
    return pako.inflate(inputArray, pakoOptions).buffer;
  }
  async *compressBatches(asyncIterator) {
    var _this$options3;
    const pakoOptions = ((_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.deflate) || {};
    const pakoProcessor = new pako.Deflate(pakoOptions);
    yield* this.transformBatches(pakoProcessor, asyncIterator);
  }
  async *decompressBatches(asyncIterator) {
    var _this$options4;
    const pakoOptions = ((_this$options4 = this.options) === null || _this$options4 === void 0 ? void 0 : _this$options4.deflate) || {};
    const pakoProcessor = new pako.Inflate(pakoOptions);
    yield* this.transformBatches(pakoProcessor, asyncIterator);
  }
  async *transformBatches(pakoProcessor, asyncIterator) {
    pakoProcessor.onData = this._onData.bind(this);
    pakoProcessor.onEnd = this._onEnd.bind(this);
    for await (const chunk of asyncIterator) {
      const uint8Array = new Uint8Array(chunk);
      const ok = pakoProcessor.push(uint8Array, false);
      if (!ok) {
        throw new Error("".concat(this._getError(), "write"));
      }
      const chunks = this._getChunks();
      yield* chunks;
    }
    const emptyChunk = new Uint8Array(0);
    const ok = pakoProcessor.push(emptyChunk, true);
    if (!ok) {}
    const chunks = this._getChunks();
    yield* chunks;
  }
  _onData(chunk) {
    this._chunks.push(chunk);
  }
  _onEnd(status) {
    if (status !== 0) {
      throw new Error(this._getError(status) + this._chunks.length);
    }
  }
  _getChunks() {
    const chunks = this._chunks;
    this._chunks = [];
    return chunks;
  }
  _getError() {
    let code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const MESSAGES = {
      2: 'need dictionary',
      1: 'stream end',
      0: '',
      '-1': 'file error',
      '-2': 'stream error',
      '-3': 'data error',
      '-4': 'insufficient memory',
      '-5': 'buffer error',
      '-6': 'incompatible version'
    };
    return "".concat(this.name, ": ").concat(MESSAGES[code]);
  }
}
//# sourceMappingURL=deflate-compression.js.map