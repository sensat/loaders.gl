import { deduceMeshSchema } from '@loaders.gl/schema';
export function getPLYSchema(plyHeader, attributes) {
  const metadata = makeMetadataFromPlyHeader(plyHeader);
  const schema = deduceMeshSchema(attributes, metadata);
  return schema;
}
function makeMetadataFromPlyHeader(plyHeader) {
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
//# sourceMappingURL=get-ply-schema.js.map