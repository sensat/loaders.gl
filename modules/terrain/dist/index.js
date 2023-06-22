"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantizedMeshLoader = exports.QuantizedMeshWorkerLoader = exports.parseTerrain = exports.TerrainLoader = exports.TerrainWorkerLoader = void 0;
const parse_quantized_mesh_1 = require("./lib/parse-quantized-mesh");
const parse_terrain_1 = require("./lib/parse-terrain");
const terrain_loader_1 = require("./terrain-loader");
Object.defineProperty(exports, "TerrainWorkerLoader", { enumerable: true, get: function () { return terrain_loader_1.TerrainLoader; } });
const quantized_mesh_loader_1 = require("./quantized-mesh-loader");
Object.defineProperty(exports, "QuantizedMeshWorkerLoader", { enumerable: true, get: function () { return quantized_mesh_loader_1.QuantizedMeshLoader; } });
exports.TerrainLoader = {
    ...terrain_loader_1.TerrainLoader,
    parse: parseTerrain
};
async function parseTerrain(arrayBuffer, options, context) {
    const loadImageOptions = {
        ...options,
        mimeType: 'application/x.image',
        image: { ...options?.image, type: 'data' }
    };
    const image = await context?.parse(arrayBuffer, loadImageOptions);
    // Extend function to support additional mesh generation options (square grid or delatin)
    const terrainOptions = { ...exports.TerrainLoader.options.terrain, ...options?.terrain };
    return (0, parse_terrain_1.makeTerrainMeshFromImage)(image, terrainOptions);
}
exports.parseTerrain = parseTerrain;
/**
 * Loader for quantized meshes
 */
exports.QuantizedMeshLoader = {
    ...quantized_mesh_loader_1.QuantizedMeshLoader,
    parseSync: (arrayBuffer, options) => (0, parse_quantized_mesh_1.parseQuantizedMesh)(arrayBuffer, options?.['quantized-mesh']),
    parse: async (arrayBuffer, options) => (0, parse_quantized_mesh_1.parseQuantizedMesh)(arrayBuffer, options?.['quantized-mesh'])
};
