const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const PotreeLoader = {
  name: 'potree',
  id: 'potree',
  module: 'potree',
  version: VERSION,
  extensions: ['json'],
  mimeTypes: ['application/json'],
  testText: text => text.indexOf('octreeDir') >= 0,
  parseTextSync: text => JSON.parse(text),
  options: {
    potree: {}
  }
};
//# sourceMappingURL=potree-loader.js.map