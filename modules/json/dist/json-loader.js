"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONLoader = void 0;
const parse_json_1 = require("./lib/parsers/parse-json");
const parse_json_in_batches_1 = require("./lib/parsers/parse-json-in-batches");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_JSON_LOADER_OPTIONS = {
    json: {
        shape: 'row-table',
        table: false,
        jsonpaths: []
        // batchSize: 'auto'
    }
};
exports.JSONLoader = {
    name: 'JSON',
    id: 'json',
    module: 'json',
    version: VERSION,
    extensions: ['json', 'geojson'],
    mimeTypes: ['application/json'],
    category: 'table',
    text: true,
    parse,
    parseTextSync,
    parseInBatches,
    options: DEFAULT_JSON_LOADER_OPTIONS
};
async function parse(arrayBuffer, options) {
    return parseTextSync(new TextDecoder().decode(arrayBuffer), options);
}
function parseTextSync(text, options) {
    const jsonOptions = { ...options, json: { ...DEFAULT_JSON_LOADER_OPTIONS.json, ...options?.json } };
    return (0, parse_json_1.parseJSONSync)(text, jsonOptions);
}
function parseInBatches(asyncIterator, options) {
    const jsonOptions = { ...options, json: { ...DEFAULT_JSON_LOADER_OPTIONS.json, ...options?.json } };
    return (0, parse_json_in_batches_1.parseJSONInBatches)(asyncIterator, jsonOptions);
}
