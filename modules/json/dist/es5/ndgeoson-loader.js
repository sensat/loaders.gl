"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckNDJSONLoader = exports.NDJSONLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parseNdjson = require("./lib/parsers/parse-ndjson");
var _parseNdjsonInBatches = require("./lib/parsers/parse-ndjson-in-batches");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_NDGEOJSON_LOADER_OPTIONS = {
  geojson: {
    shape: 'object-row-table'
  },
  gis: {
    format: 'geojson'
  }
};
var NDJSONLoader = {
  name: 'NDJSON',
  id: 'ndjson',
  module: 'json',
  version: VERSION,
  extensions: ['ndjson', 'ndgeojson'],
  mimeTypes: ['application/geo+x-ndjson', 'application/geo+x-ldjson', 'application/jsonlines', 'application/geo+json-seq', 'application/x-ndjson'],
  category: 'table',
  text: true,
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parseNdjson.parseNDJSONSync)(new TextDecoder().decode(arrayBuffer)));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }(),
  parseTextSync: _parseNdjson.parseNDJSONSync,
  parseInBatches: _parseNdjsonInBatches.parseNDJSONInBatches,
  options: DEFAULT_NDGEOJSON_LOADER_OPTIONS
};
exports.NDJSONLoader = NDJSONLoader;
var _typecheckNDJSONLoader = NDJSONLoader;
exports._typecheckNDJSONLoader = _typecheckNDJSONLoader;
//# sourceMappingURL=ndgeoson-loader.js.map