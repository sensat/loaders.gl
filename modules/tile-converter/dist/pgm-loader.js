"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PGMLoader = void 0;
const geoid_1 = require("@math.gl/geoid");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Loader for PGM - Netpbm grayscale image format
 */
exports.PGMLoader = {
    name: 'PGM - Netpbm grayscale image format',
    id: 'pgm',
    module: 'tile-converter',
    version: VERSION,
    mimeTypes: ['image/x-portable-graymap'],
    // @ts-expect-error LoaderOptions does not have cubic parameter
    parse: async (arrayBuffer, options) => (0, geoid_1.parsePGM)(new Uint8Array(arrayBuffer), options),
    extensions: ['pgm'],
    options: {
        // TODO - use pgm namespace
        cubic: false
    }
};
