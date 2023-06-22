import { parseWebscene } from './lib/parsers/parse-arcgis-webscene';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
export const ArcGisWebSceneLoader = {
  name: 'ArcGIS Web Scene Loader',
  id: 'arcgis-web-scene',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/json'],
  parse,
  extensions: ['json'],
  options: {}
};
async function parse(data) {
  return parseWebscene(data);
}
//# sourceMappingURL=arcgis-webscene-loader.js.map