"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SLPKLoader = void 0;
var _parseSlpk = require("./lib/parsers/parse-slpk/parse-slpk");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var SLPKLoader = {
  name: 'I3S SLPK (Scene Layer Package)',
  id: 'slpk',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/octet-stream'],
  parse: _parseSlpk.parseSLPK,
  extensions: ['slpk'],
  options: {}
};
exports.SLPKLoader = SLPKLoader;
//# sourceMappingURL=i3s-slpk-loader.js.map