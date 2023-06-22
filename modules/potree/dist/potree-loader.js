"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotreeLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/** Potree loader */
// @ts-ignore
exports.PotreeLoader = {
    name: 'potree',
    id: 'potree',
    module: 'potree',
    version: VERSION,
    extensions: ['json'],
    mimeTypes: ['application/json'],
    testText: (text) => text.indexOf('octreeDir') >= 0,
    parseTextSync: (text) => JSON.parse(text),
    options: {
        potree: {}
    }
};
