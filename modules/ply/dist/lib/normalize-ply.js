"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@loaders.gl/schema");
const get_ply_schema_1 = require("./get-ply-schema");
/**
 * @param header
 * @param attributes
 * @returns data and header
 */
function normalizePLY(plyHeader, plyAttributes, options) {
    const attributes = getMeshAttributes(plyAttributes);
    const boundingBox = (0, schema_1.getMeshBoundingBox)(attributes);
    const vertexCount = plyAttributes.indices.length || plyAttributes.vertices.length / 3;
    // TODO - how to detect POINT CLOUDS vs MESHES?
    // TODO - For Meshes, PLY quadrangles must be split?
    const isTriangles = plyAttributes.indices && plyAttributes.indices.length > 0;
    const mode = isTriangles ? 4 : 0; // TRIANGLES vs POINTS
    const topology = isTriangles ? 'triangle-list' : 'point-list';
    const schema = (0, get_ply_schema_1.getPLYSchema)(plyHeader, attributes);
    const plyMesh = {
        loader: 'ply',
        loaderData: plyHeader,
        header: {
            vertexCount,
            boundingBox
        },
        schema,
        attributes,
        indices: { value: new Uint32Array(0), size: 0 },
        mode,
        topology
    };
    if (plyAttributes.indices.length > 0) {
        plyMesh.indices = { value: new Uint32Array(plyAttributes.indices), size: 1 };
    }
    return plyMesh;
}
exports.default = normalizePLY;
/**
 * @param attributes
 * @returns accessors []
 */
// eslint-disable-next-line complexity
function getMeshAttributes(attributes) {
    const accessors = {};
    for (const attributeName of Object.keys(attributes)) {
        switch (attributeName) {
            case 'vertices':
                if (attributes.vertices.length > 0) {
                    accessors.POSITION = { value: new Float32Array(attributes.vertices), size: 3 };
                }
                break;
            // optional attributes data
            case 'normals':
                if (attributes.normals.length > 0) {
                    accessors.NORMAL = { value: new Float32Array(attributes.normals), size: 3 };
                }
                break;
            case 'uvs':
                if (attributes.uvs.length > 0) {
                    accessors.TEXCOORD_0 = { value: new Float32Array(attributes.uvs), size: 2 };
                }
                break;
            case 'colors':
                if (attributes.colors.length > 0) {
                    // TODO - normalized shoud be based on `uchar` flag in source data?
                    accessors.COLOR_0 = { value: new Uint8Array(attributes.colors), size: 3, normalized: true };
                }
                break;
            case 'indices':
                break;
            default:
                if (attributes[attributeName].length > 0) {
                    accessors[attributeName] = { value: new Float32Array(attributes[attributeName]), size: 1 };
                }
                break;
        }
    }
    return accessors;
}
