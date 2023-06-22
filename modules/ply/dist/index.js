"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLYLoader = exports.PLYWorkerLoader = void 0;
const ply_loader_1 = require("./ply-loader");
Object.defineProperty(exports, "PLYWorkerLoader", { enumerable: true, get: function () { return ply_loader_1.PLYLoader; } });
const parse_ply_1 = require("./lib/parse-ply");
const parse_ply_in_batches_1 = require("./lib/parse-ply-in-batches");
/**
 * Loader for PLY - Polygon File Format
 */
exports.PLYLoader = {
    ...ply_loader_1.PLYLoader,
    // Note: parsePLY supports both text and binary
    parse: async (arrayBuffer, options) => (0, parse_ply_1.parsePLY)(arrayBuffer, options?.ply),
    parseTextSync: (arrayBuffer, options) => (0, parse_ply_1.parsePLY)(arrayBuffer, options?.ply),
    parseSync: (arrayBuffer, options) => (0, parse_ply_1.parsePLY)(arrayBuffer, options?.ply),
    parseInBatches: (arrayBuffer, options) => (0, parse_ply_in_batches_1.parsePLYInBatches)(arrayBuffer, options?.ply)
};
