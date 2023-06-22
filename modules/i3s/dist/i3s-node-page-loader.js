"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I3SNodePageLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
async function parseNodePage(data, options) {
    return JSON.parse(new TextDecoder().decode(data));
}
/**
 * Loader for I3S node pages
 */
exports.I3SNodePageLoader = {
    name: 'I3S Node Page',
    id: 'i3s-node-page',
    module: 'i3s',
    version: VERSION,
    mimeTypes: ['application/json'],
    parse: parseNodePage,
    extensions: ['json'],
    options: {}
};
