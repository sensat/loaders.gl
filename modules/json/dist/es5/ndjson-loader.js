"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NDJSONLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _parseNdjson = require("./lib/parsers/parse-ndjson");
var _parseNdjsonInBatches = require("./lib/parsers/parse-ndjson-in-batches");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var NDJSONLoader = {
  name: 'NDJSON',
  id: 'ndjson',
  module: 'json',
  version: VERSION,
  extensions: ['ndjson', 'jsonl'],
  mimeTypes: ['application/x-ndjson', 'application/jsonlines', 'application/json-seq'],
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
  options: {}
};
exports.NDJSONLoader = NDJSONLoader;
//# sourceMappingURL=ndjson-loader.js.map