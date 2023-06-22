"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSONLoader = void 0;
const parse_bson_1 = require("./lib/parsers/parse-bson");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_BSON_LOADER_OPTIONS = {
    bson: {}
};
exports.BSONLoader = {
    name: 'BSON',
    id: 'bson',
    module: 'bson',
    version: VERSION,
    extensions: ['bson'],
    mimeTypes: ['application/bson'],
    category: 'json',
    binary: true,
    parse,
    parseSync,
    options: DEFAULT_BSON_LOADER_OPTIONS
};
async function parse(arrayBuffer, options) {
    const bsonOptions = { ...DEFAULT_BSON_LOADER_OPTIONS.bson, ...options?.bson };
    return (0, parse_bson_1.parseBSONSync)(arrayBuffer, bsonOptions);
}
function parseSync(arrayBuffer, options) {
    const bsonOptions = { ...DEFAULT_BSON_LOADER_OPTIONS.bson, ...options?.bson };
    return (0, parse_bson_1.parseBSONSync)(arrayBuffer, bsonOptions);
}
