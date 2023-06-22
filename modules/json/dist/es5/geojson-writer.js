"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoJSONWriter = void 0;
var _geojsonEncoder = require("./lib/encoders/geojson-encoder");
var GeoJSONWriter = {
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
  encodeInBatches: function encodeInBatches(tableIterator, options) {
    return (0, _geojsonEncoder.encodeTableAsGeojsonInBatches)(tableIterator, options);
  }
};
exports.GeoJSONWriter = GeoJSONWriter;
//# sourceMappingURL=geojson-writer.js.map