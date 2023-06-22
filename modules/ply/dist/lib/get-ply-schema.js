"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPLYSchema = void 0;
const schema_1 = require("@loaders.gl/schema");
/**
 * Gets schema from PLY header
 * @param plyHeader
 * @param metadata
 * @returns Schema
 */
function getPLYSchema(plyHeader, attributes) {
    const metadata = makeMetadataFromPlyHeader(plyHeader);
    const schema = (0, schema_1.deduceMeshSchema)(attributes, metadata);
    return schema;
}
exports.getPLYSchema = getPLYSchema;
/**
 * Make arrow like schema metadata by PlyHeader properties
 * @param plyHeader
 * @returns
 */
function makeMetadataFromPlyHeader(plyHeader) {
    /* eslint-disable camelcase */
    const metadata = {};
    metadata.ply_comments = JSON.stringify(plyHeader.comments);
    metadata.ply_elements = JSON.stringify(plyHeader.elements);
    if (plyHeader.format !== undefined) {
        metadata.ply_format = plyHeader.format;
    }
    if (plyHeader.version !== undefined) {
        metadata.ply_version = plyHeader.version;
    }
    if (plyHeader.headerLength !== undefined) {
        metadata.ply_headerLength = plyHeader.headerLength.toString(10);
    }
    return metadata;
}
