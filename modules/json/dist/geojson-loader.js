"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoJSONLoader = exports.GeoJSONWorkerLoader = void 0;
const gis_1 = require("@loaders.gl/gis");
const parse_json_1 = require("./lib/parsers/parse-json");
const parse_json_in_batches_1 = require("./lib/parsers/parse-json-in-batches");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_GEOJSON_LOADER_OPTIONS = {
    geojson: {
        shape: 'object-row-table'
    },
    json: {
        jsonpaths: ['$', '$.features']
    },
    gis: {
        format: 'geojson'
    }
};
/**
 * GeoJSON loader
 */
exports.GeoJSONWorkerLoader = {
    name: 'GeoJSON',
    id: 'geojson',
    module: 'geojson',
    version: VERSION,
    worker: true,
    extensions: ['geojson'],
    mimeTypes: ['application/geo+json'],
    category: 'geometry',
    text: true,
    options: DEFAULT_GEOJSON_LOADER_OPTIONS
};
exports.GeoJSONLoader = {
    ...exports.GeoJSONWorkerLoader,
    parse,
    parseTextSync,
    parseInBatches
};
async function parse(arrayBuffer, options) {
    return parseTextSync(new TextDecoder().decode(arrayBuffer), options);
}
function parseTextSync(text, options) {
    // Apps can call the parse method directly, we so apply default options here
    options = { ...DEFAULT_GEOJSON_LOADER_OPTIONS, ...options };
    options.json = { ...DEFAULT_GEOJSON_LOADER_OPTIONS.geojson, ...options.geojson };
    options.gis = options.gis || {};
    const table = (0, parse_json_1.parseJSONSync)(text, options);
    table.shape = 'geojson-row-table';
    switch (options.gis.format) {
        case 'binary':
            return (0, gis_1.geojsonToBinary)(table.data);
        default:
            return table;
    }
}
function parseInBatches(asyncIterator, options) {
    // Apps can call the parse method directly, we so apply default options here
    options = { ...DEFAULT_GEOJSON_LOADER_OPTIONS, ...options };
    options.json = { ...DEFAULT_GEOJSON_LOADER_OPTIONS.geojson, ...options.geojson };
    const geojsonIterator = (0, parse_json_in_batches_1.parseJSONInBatches)(asyncIterator, options);
    switch (options.gis.format) {
        case 'binary':
            return makeBinaryGeometryIterator(geojsonIterator);
        default:
            return geojsonIterator;
    }
}
async function* makeBinaryGeometryIterator(geojsonIterator) {
    for await (const batch of geojsonIterator) {
        batch.data = (0, gis_1.geojsonToBinary)(batch.data);
        yield batch;
    }
}
