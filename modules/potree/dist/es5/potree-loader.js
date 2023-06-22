"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PotreeLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var PotreeLoader = {
  name: 'potree',
  id: 'potree',
  module: 'potree',
  version: VERSION,
  extensions: ['json'],
  mimeTypes: ['application/json'],
  testText: function testText(text) {
    return text.indexOf('octreeDir') >= 0;
  },
  parseTextSync: function parseTextSync(text) {
    return JSON.parse(text);
  },
  options: {
    potree: {}
  }
};
exports.PotreeLoader = PotreeLoader;
//# sourceMappingURL=potree-loader.js.map