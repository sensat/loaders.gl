import { parse } from '@loaders.gl/core';
import { I3SContentLoader } from './i3s-content-loader';
import { normalizeTileData, normalizeTilesetData } from './lib/parsers/parse-i3s';
import { COORDINATE_SYSTEM } from './lib/parsers/constants';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const TILESET_REGEX = /layers\/[0-9]+$/;
const TILE_HEADER_REGEX = /nodes\/([0-9-]+|root)$/;
const SLPK_HEX = '504b0304';
const POINT_CLOUD = 'PointCloud';
export const I3SLoader = {
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
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      colorsByAttribute: null
    }
  }
};
async function parseI3S(data) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let context = arguments.length > 2 ? arguments[2] : undefined;
  const url = context.url;
  options.i3s = options.i3s || {};
  const magicNumber = getMagicNumber(data);
  if (magicNumber === SLPK_HEX) {
    throw new Error('Files with .slpk extention currently are not supported by I3SLoader');
  }
  let isTileset;
  if (options.i3s.isTileset === 'auto') {
    isTileset = TILESET_REGEX.test(url);
  } else {
    isTileset = options.i3s.isTileset;
  }
  let isTileHeader;
  if (options.isTileHeader === 'auto') {
    isTileHeader = TILE_HEADER_REGEX.test(url);
  } else {
    isTileHeader = options.i3s.isTileHeader;
  }
  if (isTileset) {
    data = await parseTileset(data, options, context);
  } else if (isTileHeader) {
    data = await parseTile(data, context);
  } else {
    data = await parseTileContent(data, options);
  }
  return data;
}
async function parseTileContent(arrayBuffer, options) {
  return await parse(arrayBuffer, I3SContentLoader, options);
}
async function parseTileset(data, options, context) {
  const tilesetJson = JSON.parse(new TextDecoder().decode(data));
  if ((tilesetJson === null || tilesetJson === void 0 ? void 0 : tilesetJson.layerType) === POINT_CLOUD) {
    throw new Error('Point Cloud layers currently are not supported by I3SLoader');
  }
  tilesetJson.loader = I3SLoader;
  await normalizeTilesetData(tilesetJson, options, context);
  return tilesetJson;
}
async function parseTile(data, context) {
  data = JSON.parse(new TextDecoder().decode(data));
  return normalizeTileData(data, context);
}
function getMagicNumber(data) {
  if (data instanceof ArrayBuffer) {
    return [...new Uint8Array(data, 0, 4)].map(value => value.toString(16).padStart(2, '0')).join('');
  }
  return null;
}
//# sourceMappingURL=i3s-loader.js.map