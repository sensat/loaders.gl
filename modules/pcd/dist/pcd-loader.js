"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.PCDLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Worker loader for PCD - Point Cloud Data
 */
exports.PCDLoader = {
    name: 'PCD (Point Cloud Data)',
    id: 'pcd',
    module: 'pcd',
    version: VERSION,
    worker: true,
    extensions: ['pcd'],
    mimeTypes: ['text/plain'],
    options: {
        pcd: {}
    }
};
