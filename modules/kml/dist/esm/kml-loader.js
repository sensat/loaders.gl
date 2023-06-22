import { geojsonToBinary } from '@loaders.gl/gis';
import { kml } from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const KML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<kml xmlns=\"http://www.opengis.net/kml/2.2\">";
export const KMLLoader = {
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
  var _options$gis, _options$kml, _options$kml2;
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  const geojson = kml(doc);
  const shape = (options === null || options === void 0 ? void 0 : (_options$gis = options.gis) === null || _options$gis === void 0 ? void 0 : _options$gis.format) || (options === null || options === void 0 ? void 0 : (_options$kml = options.kml) === null || _options$kml === void 0 ? void 0 : _options$kml.type) || (options === null || options === void 0 ? void 0 : (_options$kml2 = options.kml) === null || _options$kml2 === void 0 ? void 0 : _options$kml2.shape);
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
export const _typecheckKMLLoader = KMLLoader;
//# sourceMappingURL=kml-loader.js.map