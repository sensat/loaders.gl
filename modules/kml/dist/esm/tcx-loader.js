import { geojsonToBinary } from '@loaders.gl/gis';
import { tcx } from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const TCX_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<TrainingCenterDatabase";
export const TCXLoader = {
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
  var _options$gis, _options$tcx, _options$tcx2;
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  const geojson = tcx(doc);
  const shape = (options === null || options === void 0 ? void 0 : (_options$gis = options.gis) === null || _options$gis === void 0 ? void 0 : _options$gis.format) || (options === null || options === void 0 ? void 0 : (_options$tcx = options.tcx) === null || _options$tcx === void 0 ? void 0 : _options$tcx.type) || (options === null || options === void 0 ? void 0 : (_options$tcx2 = options.tcx) === null || _options$tcx2 === void 0 ? void 0 : _options$tcx2.shape);
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
export const _typecheckTCXLoader = TCXLoader;
//# sourceMappingURL=tcx-loader.js.map