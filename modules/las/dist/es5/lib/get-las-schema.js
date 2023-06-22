"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLASSchema = getLASSchema;
exports.makeMetadataFromLasHeader = makeMetadataFromLasHeader;
var _schema = require("@loaders.gl/schema");
function getLASSchema(lasHeader, attributes) {
  var metadataMap = makeMetadataFromLasHeader(lasHeader);
  var schema = (0, _schema.deduceMeshSchema)(attributes, metadataMap);
  return schema;
}
function makeMetadataFromLasHeader(lasHeader) {
  var metadata = {};
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
//# sourceMappingURL=get-las-schema.js.map