"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadableStreamPolyfill = void 0;
const web_streams_polyfill_1 = require("web-streams-polyfill");
// Want a polyfill, but please don't install it
// @ts-ignore
delete global.ReadableStream;
// @ts-ignore
class ReadableStreamPolyfill extends web_streams_polyfill_1.ReadableStream {
}
exports.ReadableStreamPolyfill = ReadableStreamPolyfill;
