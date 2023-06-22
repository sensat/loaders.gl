import { parseBuildingSceneLayer } from './lib/parsers/parse-i3s-building-scene-layer';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
export const I3SBuildingSceneLayerLoader = {
  name: 'I3S Building Scene Layer',
  id: 'i3s-building-scene-layer',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/json'],
  parse,
  extensions: ['json'],
  options: {}
};
async function parse(data, options, context) {
  if (!(context !== null && context !== void 0 && context.url)) {
    throw new Error('Url is not provided');
  }
  return parseBuildingSceneLayer(data, context.url);
}
//# sourceMappingURL=i3s-building-scene-layer-loader.js.map