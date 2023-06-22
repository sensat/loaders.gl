"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMetadataFromLasHeader = exports.getLASSchema = void 0;
const schema_1 = require("@loaders.gl/schema");
/**
 * Gets schema from PLY header
 * @param lasHeader
 * @param metadata
 * @returns Schema
 */
function getLASSchema(lasHeader, attributes) {
    const metadataMap = makeMetadataFromLasHeader(lasHeader);
    const schema = (0, schema_1.deduceMeshSchema)(attributes, metadataMap);
    return schema;
}
exports.getLASSchema = getLASSchema;
/**
 * Make arrow like schema metadata by LASHeader properties
 * @param lasHeader
 * @returns
 */
function makeMetadataFromLasHeader(lasHeader) {
    const metadata = {};
    /* eslint-disable camelcase */
    metadata.las_pointsOffset = lasHeader.pointsOffset.toString(10);
    metadata.las_pointsFormatId = lasHeader.pointsFormatId.toString(10);
    metadata.las_pointsStructSize = lasHeader.pointsStructSize.toString(10);
    metadata.las_pointsCount = lasHeader.pointsCount.toString(10);
    metadata.las_scale = JSON.stringify(lasHeader.scale);
    metadata.las_offset = JSON.stringify(lasHeader.offset);
    if (lasHeader.maxs !== undefined) {
        metadata.las_maxs = JSON.stringify(lasHeader.maxs);
    }
    if (lasHeader.mins !== undefined) {
        metadata.las_mins = JSON.stringify(lasHeader.mins);
    }
    metadata.las_totalToRead = lasHeader.totalToRead.toString(10);
    metadata.las_pointsFortotalReadmatId = lasHeader.totalRead.toString(10);
    if (lasHeader.versionAsString !== undefined) {
        metadata.las_versionAsString = lasHeader.versionAsString;
    }
    if (lasHeader.isCompressed !== undefined) {
        metadata.las_isCompressed = lasHeader.isCompressed.toString();
    }
    return metadata;
}
exports.makeMetadataFromLasHeader = makeMetadataFromLasHeader;
