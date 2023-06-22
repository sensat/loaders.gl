import { default as parsePotreeHierarchyChunk } from './parsers/parse-potree-hierarchy-chunk';
export const PotreeHierarchyChunkLoader = {
  id: 'potree',
  name: 'potree Hierarchy Chunk',
  extensions: ['hrc'],
  mimeTypes: ['application/octet-stream'],
  parse: async (arrayBuffer, options) => await parseSync(arrayBuffer),
  parseSync,
  binary: true
};
function parseSync(arrayBuffer) {
  return parsePotreeHierarchyChunk(arrayBuffer);
}
//# sourceMappingURL=potree-hierarchy-chunk-loader.js.map