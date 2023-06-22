import { ReadableStreamPolyfill } from './readable-stream';
import { BlobPolyfill } from './blob';
import { FileReaderPolyfill } from './file-reader';
import { FilePolyfill } from './file';
export function installFilePolyfills() {
  if (typeof ReadableStream === 'undefined' && global) {
    global.ReadableStream = ReadableStreamPolyfill;
  }
  if (typeof Blob === 'undefined' && global) {
    global.Blob = BlobPolyfill;
  }
  if (typeof FileReader === 'undefined' && global) {
    global.FileReader = FileReaderPolyfill;
  }
  if (typeof File === 'undefined' && global) {
    global.File = FilePolyfill;
  }
}
//# sourceMappingURL=install-file-polyfills.js.map