import { default as parsePotreeBin } from './parsers/parse-potree-bin';
export const PotreeBinLoader = {
  name: 'potree Binary Point Attributes',
  id: 'potree',
  extensions: ['bin'],
  mimeTypes: ['application/octet-stream'],
  parseSync,
  binary: true
};
function parseSync(arrayBuffer, options) {
  const index = {};
  const byteOffset = 0;
  parsePotreeBin(arrayBuffer, byteOffset, options, index);
  return index;
}
//# sourceMappingURL=potree-bin-loader.js.map