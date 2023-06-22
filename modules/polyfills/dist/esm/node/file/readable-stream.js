import { ReadableStream as WSPReadableStream } from 'web-streams-polyfill';
delete global.ReadableStream;
export class ReadableStreamPolyfill extends WSPReadableStream {}
//# sourceMappingURL=readable-stream.js.map