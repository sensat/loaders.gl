"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckArrowLoader = exports.ArrowLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/** ArrowJS table loader */
exports.ArrowLoader = {
    name: 'Apache Arrow',
    id: 'arrow',
    module: 'arrow',
    version: VERSION,
    // worker: true,
    category: 'table',
    extensions: ['arrow', 'feather'],
    mimeTypes: [
        'application/vnd.apache.arrow.file',
        'application/vnd.apache.arrow.stream',
        'application/octet-stream'
    ],
    binary: true,
    tests: ['ARROW'],
    options: {
        arrow: {
            shape: 'columnar-table'
        }
    }
};
exports._typecheckArrowLoader = exports.ArrowLoader;
