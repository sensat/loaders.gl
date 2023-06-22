"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckKMLLoader = exports.KMLLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _gis = require("@loaders.gl/gis");
var _togeojson = require("@tmcw/togeojson");
var _xmldom = require("@xmldom/xmldom");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var KML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<kml xmlns=\"http://www.opengis.net/kml/2.2\">";
var KMLLoader = {
  name: 'KML (Keyhole Markup Language)',
  id: 'kml',
  module: 'kml',
  version: VERSION,
  extensions: ['kml'],
  mimeTypes: ['application/vnd.google-earth.kml+xml'],
  text: true,
  tests: [KML_HEADER],
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", parseTextSync(new TextDecoder().decode(arrayBuffer), options));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x, _x2) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }(),
  parseTextSync: parseTextSync,
  options: {
    kml: {},
    gis: {}
  }
};
exports.KMLLoader = KMLLoader;
function parseTextSync(text, options) {
  var _options$gis, _options$kml, _options$kml2;
  var doc = new _xmldom.DOMParser().parseFromString(text, 'text/xml');
  var geojson = (0, _togeojson.kml)(doc);
  var shape = (options === null || options === void 0 ? void 0 : (_options$gis = options.gis) === null || _options$gis === void 0 ? void 0 : _options$gis.format) || (options === null || options === void 0 ? void 0 : (_options$kml = options.kml) === null || _options$kml === void 0 ? void 0 : _options$kml.type) || (options === null || options === void 0 ? void 0 : (_options$kml2 = options.kml) === null || _options$kml2 === void 0 ? void 0 : _options$kml2.shape);
  switch (shape) {
    case 'object-row-table':
      {
        var table = {
          shape: 'object-row-table',
          data: geojson.features
        };
        return table;
      }
    case 'geojson-row-table':
      {
        var _table = {
          shape: 'geojson-row-table',
          data: geojson.features
        };
        return _table;
      }
    case 'geojson':
      return geojson;
    case 'binary':
      return (0, _gis.geojsonToBinary)(geojson.features);
    case 'raw':
      return doc;
    default:
      return geojson;
  }
}
var _typecheckKMLLoader = KMLLoader;
exports._typecheckKMLLoader = _typecheckKMLLoader;
//# sourceMappingURL=kml-loader.js.map