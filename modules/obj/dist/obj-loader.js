"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckOBJLoader = exports.OBJLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Worker loader for the OBJ geometry format
 */
exports.OBJLoader = {
    name: 'OBJ',
    id: 'obj',
    module: 'obj',
    version: VERSION,
    worker: true,
    extensions: ['obj'],
    mimeTypes: ['text/plain'],
    testText: testOBJFile,
    options: {
        obj: {}
    }
};
function testOBJFile(text) {
    // TODO - There could be comment line first
    return text[0] === 'v';
}
exports._typecheckOBJLoader = exports.OBJLoader;
