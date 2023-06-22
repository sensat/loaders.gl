export function getGeoMetadata(schema) {
  const stringifiedGeoMetadata = schema.metadata.geo;
  if (!stringifiedGeoMetadata) {
    return null;
  }
  try {
    const geoMetadata = JSON.parse(stringifiedGeoMetadata);
    return geoMetadata;
  } catch {
    return null;
  }
}
export function setGeoMetadata(schema, geoMetadata) {
  const stringifiedGeoMetadata = JSON.stringify(geoMetadata);
  schema.metadata.geo = stringifiedGeoMetadata;
}
export function unpackGeoMetadata(schema) {
  const geoMetadata = getGeoMetadata(schema);
  if (!geoMetadata) {
    return;
  }
  const {
    version,
    primary_column,
    columns
  } = geoMetadata;
  if (version) {
    schema.metadata['geo.version'] = version;
  }
  if (primary_column) {
    schema.metadata['geo.primary_column'] = primary_column;
  }
  schema.metadata['geo.columns'] = Object.keys(columns || {}).join('');
  for (const [columnName, columnMetadata] of Object.entries(columns || {})) {
    const field = schema.fields.find(field => field.name === columnName);
    if (field) {
      if (field.name === primary_column) {
        setFieldMetadata(field, 'geo.primary_field', 'true');
      }
      unpackGeoFieldMetadata(field, columnMetadata);
    }
  }
}
function unpackGeoFieldMetadata(field, columnMetadata) {
  for (const [key, value] of Object.entries(columnMetadata || {})) {
    switch (key) {
      case 'geometry_type':
        setFieldMetadata(field, "geo.".concat(key), value.join(','));
        break;
      case 'bbox':
      case 'crs':
      case 'edges':
      default:
        setFieldMetadata(field, "geo.".concat(key), typeof value === 'string' ? value : JSON.stringify(value));
    }
  }
}
function setFieldMetadata(field, key, value) {
  field.metadata = field.metadata || {};
  field.metadata[key] = value;
}
//# sourceMappingURL=decode-geo-metadata.js.map