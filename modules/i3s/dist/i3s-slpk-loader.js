"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLPKLoader = void 0;
const parse_slpk_1 = require("./lib/parsers/parse-slpk/parse-slpk");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Loader for SLPK - Scene Layer Package
 */
exports.SLPKLoader = {
    name: 'I3S SLPK (Scene Layer Package)',
    id: 'slpk',
    module: 'i3s',
    version: VERSION,
    mimeTypes: ['application/octet-stream'],
    parse: parse_slpk_1.parseSLPK,
    extensions: ['slpk'],
    options: {}
};
