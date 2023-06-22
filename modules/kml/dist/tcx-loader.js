"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckTCXLoader = exports.TCXLoader = void 0;
const gis_1 = require("@loaders.gl/gis");
const togeojson_1 = require("@tmcw/togeojson");
const xmldom_1 = require("@xmldom/xmldom");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const TCX_HEADER = `\
<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase`;
/**
 * Loader for TCX (Training Center XML) - Garmin GPS track format
 */
exports.TCXLoader = {
    name: 'TCX (Training Center XML)',
    id: 'tcx',
    module: 'kml',
    version: VERSION,
    extensions: ['tcx'],
    mimeTypes: ['application/vnd.garmin.tcx+xml'],
    text: true,
    tests: [TCX_HEADER],
    parse: async (arrayBuffer, options) => parseTextSync(new TextDecoder().decode(arrayBuffer), options),
    parseTextSync,
    options: {
        tcx: {},
        gis: {}
    }
};
function parseTextSync(text, options) {
    const doc = new xmldom_1.DOMParser().parseFromString(text, 'text/xml');
    const geojson = (0, togeojson_1.tcx)(doc);
    // backwards compatibility
    const shape = options?.gis?.format || options?.tcx?.type || options?.tcx?.shape;
    switch (shape) {
        case 'object-row-table': {
            const table = {
                shape: 'object-row-table',
                data: geojson.features
            };
            return table;
        }
        case 'geojson-row-table': {
            const table = {
                shape: 'geojson-row-table',
                data: geojson.features
            };
            return table;
        }
        case 'geojson':
            return geojson;
        case 'binary':
            return (0, gis_1.geojsonToBinary)(geojson.features);
        case 'raw':
            return doc;
        default:
            // Default to geojson for backwards compatibility
            return geojson;
    }
}
exports._typecheckTCXLoader = exports.TCXLoader;
