"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowWriter = void 0;
var _encodeArrow = require("./lib/encode-arrow");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var ArrowWriter = {
  name: 'Apache Arrow',
  id: 'arrow',
  module: 'arrow',
  version: VERSION,
  extensions: ['arrow', 'feather'],
  mimeTypes: ['application/vnd.apache.arrow.file', 'application/vnd.apache.arrow.stream', 'application/octet-stream'],
  encodeSync: function encodeSync(data, options) {
    return (0, _encodeArrow.encodeArrowSync)(data);
  },
  binary: true,
  options: {}
};
exports.ArrowWriter = ArrowWriter;
//# sourceMappingURL=arrow-writer.js.map