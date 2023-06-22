import { encodeTableAsGeojsonInBatches } from './lib/encoders/geojson-encoder';
export const GeoJSONWriter = {
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
  encodeInBatches: (tableIterator, options) => encodeTableAsGeojsonInBatches(tableIterator, options)
};
//# sourceMappingURL=geojson-writer.js.map