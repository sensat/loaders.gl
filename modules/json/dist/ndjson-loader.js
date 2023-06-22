"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.NDJSONLoader = void 0;
const parse_ndjson_1 = require("./lib/parsers/parse-ndjson");
const parse_ndjson_in_batches_1 = require("./lib/parsers/parse-ndjson-in-batches");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
exports.NDJSONLoader = {
    name: 'NDJSON',
    id: 'ndjson',
    module: 'json',
    version: VERSION,
    extensions: ['ndjson', 'jsonl'],
    mimeTypes: [
        'application/x-ndjson',
        'application/jsonlines',
        'application/json-seq'
    ],
    category: 'table',
    text: true,
    parse: async (arrayBuffer) => (0, parse_ndjson_1.parseNDJSONSync)(new TextDecoder().decode(arrayBuffer)),
    parseTextSync: parse_ndjson_1.parseNDJSONSync,
    parseInBatches: parse_ndjson_in_batches_1.parseNDJSONInBatches,
    options: {}
};
