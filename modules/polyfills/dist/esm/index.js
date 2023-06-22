import { isBrowser, global } from './utils/globals';
import { TextDecoder, TextEncoder } from './lib/encoding';
import { allSettled } from './promise/all-settled';
import * as base64 from './node/buffer/btoa.node';
import { Headers as HeadersNode } from './node/fetch/headers.node';
import { Response as ResponseNode } from './node/fetch/response.node';
import { fetchNode } from './node/fetch/fetch.node';
import { encodeImageNode } from './node/images/encode-image.node';
import { parseImageNode, NODE_FORMAT_SUPPORT } from './node/images/parse-image.node';
export { ReadableStreamPolyfill } from './node/file/readable-stream';
export { BlobPolyfill } from './node/file/blob';
export { FileReaderPolyfill } from './node/file/file-reader';
export { FilePolyfill } from './node/file/file';
export { installFilePolyfills } from './node/file/install-file-polyfills';
export { fetchNode as _fetchNode } from './node/fetch/fetch.node';
export { fetchFileNode as _fetchFileNode } from './node/fetch/fetch-file.node';
const installTextEncoder = !isBrowser || !('TextEncoder' in global);
if (installTextEncoder) {
  global['TextEncoder'] = TextEncoder;
}
const installTextDecoder = !isBrowser || !('TextDecoder' in global);
if (installTextDecoder) {
  global['TextDecoder'] = TextDecoder;
}
if (!isBrowser && !('atob' in global) && base64.atob) {
  global['atob'] = base64.atob;
}
if (!isBrowser && !('btoa' in global) && base64.btoa) {
  global['btoa'] = base64.btoa;
}
if (!isBrowser && !('Headers' in global) && HeadersNode) {
  global['Headers'] = HeadersNode;
}
if (!isBrowser && !('Response' in global) && ResponseNode) {
  global['Response'] = ResponseNode;
}
if (!isBrowser && !('fetch' in global) && fetchNode) {
  global['fetch'] = fetchNode;
}
if (!isBrowser && !('_encodeImageNode' in global) && encodeImageNode) {
  global['_encodeImageNode'] = encodeImageNode;
}
if (!isBrowser && !('_parseImageNode' in global) && parseImageNode) {
  global['_parseImageNode'] = parseImageNode;
  global['_imageFormatsNode'] = NODE_FORMAT_SUPPORT;
}
if (!('allSettled' in Promise)) {
  Promise.allSettled = allSettled;
}
//# sourceMappingURL=index.js.map