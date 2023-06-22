"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowWriter = void 0;
const encode_arrow_1 = require("./lib/encode-arrow");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/** Apache Arrow writer */
exports.ArrowWriter = {
    name: 'Apache Arrow',
    id: 'arrow',
    module: 'arrow',
    version: VERSION,
    extensions: ['arrow', 'feather'],
    mimeTypes: [
        'application/vnd.apache.arrow.file',
        'application/vnd.apache.arrow.stream',
        'application/octet-stream'
    ],
    encodeSync(data, options) {
        return (0, encode_arrow_1.encodeArrowSync)(data);
    },
    binary: true,
    options: {}
};
