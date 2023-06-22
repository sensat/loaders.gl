"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckFlatGeobufLoader = exports.FlatGeobufLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
exports.FlatGeobufLoader = {
    id: 'flatgeobuf',
    name: 'FlatGeobuf',
    module: 'flatgeobuf',
    version: VERSION,
    worker: true,
    extensions: ['fgb'],
    mimeTypes: ['application/octet-stream'],
    category: 'geometry',
    options: {
        flatgeobuf: {
            // Set to GeoJSON for backwards compatibility
            shape: 'geojson'
        }
    }
};
exports._typecheckFlatGeobufLoader = exports.FlatGeobufLoader;
