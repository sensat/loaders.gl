import { geojsonToBinary } from '@loaders.gl/gis';
import { gpx } from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const GPX_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<gpx";
export const GPXLoader = {
  name: 'GPX (GPS exchange format)',
  id: 'gpx',
  module: 'kml',
  version: VERSION,
  extensions: ['gpx'],
  mimeTypes: ['application/gpx+xml'],
  text: true,
  tests: [GPX_HEADER],
  parse: async (arrayBuffer, options) => parseTextSync(new TextDecoder().decode(arrayBuffer), options),
  parseTextSync,
  options: {
    gpx: {},
    gis: {}
  }
};
function parseTextSync(text, options) {
  var _options$gis, _options$gpx, _options$gpx2;
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  const geojson = gpx(doc);
  const shape = (options === null || options === void 0 ? void 0 : (_options$gis = options.gis) === null || _options$gis === void 0 ? void 0 : _options$gis.format) || (options === null || options === void 0 ? void 0 : (_options$gpx = options.gpx) === null || _options$gpx === void 0 ? void 0 : _options$gpx.type) || (options === null || options === void 0 ? void 0 : (_options$gpx2 = options.gpx) === null || _options$gpx2 === void 0 ? void 0 : _options$gpx2.shape);
  switch (shape) {
    case 'object-row-table':
      {
        const table = {
          shape: 'object-row-table',
          data: geojson.features
        };
        return table;
      }
    case 'geojson-row-table':
      {
        const table = {
          shape: 'geojson-row-table',
          data: geojson.features
        };
        return table;
      }
    case 'geojson':
      return geojson;
    case 'binary':
      return geojsonToBinary(geojson.features);
    case 'raw':
      return doc;
    default:
      return geojson;
  }
}
export const _typecheckGPXLoader = GPXLoader;
//# sourceMappingURL=gpx-loader.js.map