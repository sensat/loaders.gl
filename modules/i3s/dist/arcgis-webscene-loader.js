"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArcGisWebSceneLoader = void 0;
const parse_arcgis_webscene_1 = require("./lib/parsers/parse-arcgis-webscene");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'beta';
/**
 * Loader for ArcGis WebScene
 * Spec - https://developers.arcgis.com/web-scene-specification/objects/webscene/
 */
exports.ArcGisWebSceneLoader = {
    name: 'ArcGIS Web Scene Loader',
    id: 'arcgis-web-scene',
    module: 'i3s',
    version: VERSION,
    mimeTypes: ['application/json'],
    parse,
    extensions: ['json'],
    options: {}
};
/**
 * Parse ArcGis webscene
 * @param data
 */
async function parse(data) {
    return (0, parse_arcgis_webscene_1.parseWebscene)(data);
}
