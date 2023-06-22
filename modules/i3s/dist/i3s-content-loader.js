"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I3SContentLoader = void 0;
const parse_i3s_tile_content_1 = require("./lib/parsers/parse-i3s-tile-content");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'beta';
/**
 * Loader for I3S - Indexed 3D Scene Layer
 */
exports.I3SContentLoader = {
    name: 'I3S Content (Indexed Scene Layers)',
    id: 'i3s-content',
    module: 'i3s',
    worker: true,
    version: VERSION,
    mimeTypes: ['application/octet-stream'],
    parse,
    extensions: ['bin'],
    options: {
        'i3s-content': {}
    }
};
async function parse(data, options, context) {
    const { tile, _tileOptions, tileset, _tilesetOptions } = options?.i3s || {};
    const tileOptions = _tileOptions || tile;
    const tilesetOptions = _tilesetOptions || tileset;
    if (!tileOptions || !tilesetOptions) {
        return null;
    }
    return await (0, parse_i3s_tile_content_1.parseI3STileContent)(data, tileOptions, tilesetOptions, options, context);
}
