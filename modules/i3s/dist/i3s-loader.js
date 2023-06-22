"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I3SLoader = void 0;
const core_1 = require("@loaders.gl/core");
const i3s_content_loader_1 = require("./i3s-content-loader");
const parse_i3s_1 = require("./lib/parsers/parse-i3s");
const constants_1 = require("./lib/parsers/constants");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const TILESET_REGEX = /layers\/[0-9]+$/;
const TILE_HEADER_REGEX = /nodes\/([0-9-]+|root)$/;
const SLPK_HEX = '504b0304';
const POINT_CLOUD = 'PointCloud';
/**
 * Loader for I3S - Indexed 3D Scene Layer
 */
exports.I3SLoader = {
    name: 'I3S (Indexed Scene Layers)',
    id: 'i3s',
    module: 'i3s',
    version: VERSION,
    mimeTypes: ['application/octet-stream'],
    parse: parseI3S,
    extensions: ['bin'],
    options: {
        i3s: {
            token: null,
            isTileset: 'auto',
            isTileHeader: 'auto',
            tile: null,
            tileset: null,
            _tileOptions: null,
            _tilesetOptions: null,
            useDracoGeometry: true,
            useCompressedTextures: true,
            decodeTextures: true,
            coordinateSystem: constants_1.COORDINATE_SYSTEM.METER_OFFSETS,
            colorsByAttribute: null
        }
    }
};
async function parseI3S(data, options = {}, context) {
    const url = context.url;
    options.i3s = options.i3s || {};
    const magicNumber = getMagicNumber(data);
    // check if file is slpk
    if (magicNumber === SLPK_HEX) {
        throw new Error('Files with .slpk extention currently are not supported by I3SLoader');
    }
    // auto detect file type based on url
    let isTileset;
    if (options.i3s.isTileset === 'auto') {
        isTileset = TILESET_REGEX.test(url);
    }
    else {
        isTileset = options.i3s.isTileset;
    }
    let isTileHeader;
    if (options.isTileHeader === 'auto') {
        isTileHeader = TILE_HEADER_REGEX.test(url);
    }
    else {
        isTileHeader = options.i3s.isTileHeader;
    }
    if (isTileset) {
        data = await parseTileset(data, options, context);
    }
    else if (isTileHeader) {
        data = await parseTile(data, context);
    }
    else {
        data = await parseTileContent(data, options);
    }
    return data;
}
async function parseTileContent(arrayBuffer, options) {
    return await (0, core_1.parse)(arrayBuffer, i3s_content_loader_1.I3SContentLoader, options);
}
async function parseTileset(data, options, context) {
    const tilesetJson = JSON.parse(new TextDecoder().decode(data));
    if (tilesetJson?.layerType === POINT_CLOUD) {
        throw new Error('Point Cloud layers currently are not supported by I3SLoader');
    }
    // eslint-disable-next-line no-use-before-define
    tilesetJson.loader = exports.I3SLoader;
    await (0, parse_i3s_1.normalizeTilesetData)(tilesetJson, options, context);
    return tilesetJson;
}
async function parseTile(data, context) {
    data = JSON.parse(new TextDecoder().decode(data));
    return (0, parse_i3s_1.normalizeTileData)(data, context);
}
function getMagicNumber(data) {
    if (data instanceof ArrayBuffer) {
        // slice binary data (4 bytes from the beginning) and transform it to hexadecimal numeral system
        return [...new Uint8Array(data, 0, 4)]
            .map((value) => value.toString(16).padStart(2, '0'))
            .join('');
    }
    return null;
}
