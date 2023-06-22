"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckMTLLoader = exports.MTLLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Loader for the MTL material format
 * Parses a Wavefront .mtl file specifying materials
 */
exports.MTLLoader = {
    name: 'MTL',
    id: 'mtl',
    module: 'mtl',
    version: VERSION,
    worker: true,
    extensions: ['mtl'],
    mimeTypes: ['text/plain'],
    testText: (text) => text.includes('newmtl'),
    options: {
        mtl: {}
    }
};
exports._typecheckMTLLoader = exports.MTLLoader;
