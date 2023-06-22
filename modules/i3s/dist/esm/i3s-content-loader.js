import { parseI3STileContent } from './lib/parsers/parse-i3s-tile-content';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
export const I3SContentLoader = {
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
  const {
    tile,
    _tileOptions,
    tileset,
    _tilesetOptions
  } = (options === null || options === void 0 ? void 0 : options.i3s) || {};
  const tileOptions = _tileOptions || tile;
  const tilesetOptions = _tilesetOptions || tileset;
  if (!tileOptions || !tilesetOptions) {
    return null;
  }
  return await parseI3STileContent(data, tileOptions, tilesetOptions, options, context);
}
//# sourceMappingURL=i3s-content-loader.js.map