"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I3SBuildingSceneLayerLoader = void 0;
const parse_i3s_building_scene_layer_1 = require("./lib/parsers/parse-i3s-building-scene-layer");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'beta';
/**
 * Loader for I3S - Building Scene Layer
 */
exports.I3SBuildingSceneLayerLoader = {
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
    if (!context?.url) {
        throw new Error('Url is not provided');
    }
    return (0, parse_i3s_building_scene_layer_1.parseBuildingSceneLayer)(data, context.url);
}
