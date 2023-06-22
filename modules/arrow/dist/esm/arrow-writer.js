import { encodeArrowSync } from './lib/encode-arrow';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const ArrowWriter = {
  name: 'Apache Arrow',
  id: 'arrow',
  module: 'arrow',
  version: VERSION,
  extensions: ['arrow', 'feather'],
  mimeTypes: ['application/vnd.apache.arrow.file', 'application/vnd.apache.arrow.stream', 'application/octet-stream'],
  encodeSync(data, options) {
    return encodeArrowSync(data);
  },
  binary: true,
  options: {}
};
//# sourceMappingURL=arrow-writer.js.map