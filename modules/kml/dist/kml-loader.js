"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckKMLLoader = exports.KMLLoader = void 0;
const gis_1 = require("@loaders.gl/gis");
const togeojson_1 = require("@tmcw/togeojson");
const xmldom_1 = require("@xmldom/xmldom");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const KML_HEADER = `\
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">`;
/**
 * Loader for KML (Keyhole Markup Language)
 */
exports.KMLLoader = {
    name: 'KML (Keyhole Markup Language)',
    id: 'kml',
    module: 'kml',
    version: VERSION,
    extensions: ['kml'],
    mimeTypes: ['application/vnd.google-earth.kml+xml'],
    text: true,
    tests: [KML_HEADER],
    parse: async (arrayBuffer, options) => parseTextSync(new TextDecoder().decode(arrayBuffer), options),
    parseTextSync,
    options: {
        kml: {},
        gis: {}
    }
};
function parseTextSync(text, options) {
    const doc = new xmldom_1.DOMParser().parseFromString(text, 'text/xml');
    const geojson = (0, togeojson_1.kml)(doc);
    // backwards compatibility
    const shape = options?.gis?.format || options?.kml?.type || options?.kml?.shape;
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
exports._typecheckKMLLoader = exports.KMLLoader;
