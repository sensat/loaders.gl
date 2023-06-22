"use strict";
// loaders.gl, MIT license
// Copyright Foursquare, Inc 20222
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoJSONWriter = void 0;
const geojson_encoder_1 = require("./lib/encoders/geojson-encoder");
exports.GeoJSONWriter = {
    id: 'geojson',
    version: 'latest',
    module: 'geojson',
    name: 'GeoJSON',
    extensions: ['geojson'],
    mimeTypes: ['application/geo+json'],
    options: {
        geojson: {
            featureArray: false,
            geometryColumn: null
        }
    },
    text: true,
    encodeInBatches: (tableIterator, options) => (0, geojson_encoder_1.encodeTableAsGeojsonInBatches)(tableIterator, options)
};
