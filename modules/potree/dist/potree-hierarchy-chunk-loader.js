"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotreeHierarchyChunkLoader = void 0;
const parse_potree_hierarchy_chunk_1 = __importDefault(require("./parsers/parse-potree-hierarchy-chunk"));
/** Potree hierarchy chunk loader */
// @ts-ignore
exports.PotreeHierarchyChunkLoader = {
    id: 'potree',
    name: 'potree Hierarchy Chunk',
    extensions: ['hrc'],
    mimeTypes: ['application/octet-stream'],
    // binary potree files have no header bytes, no content test function possible
    // test: ['...'],
    parse: async (arrayBuffer, options) => await parseSync(arrayBuffer),
    parseSync,
    binary: true
};
function parseSync(arrayBuffer) {
    return (0, parse_potree_hierarchy_chunk_1.default)(arrayBuffer);
}
