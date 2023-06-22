"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackGeoMetadata = exports.setGeoMetadata = exports.getGeoMetadata = void 0;
/**
 * Reads the GeoMetadata object from the metadata
 * @note geoarrow / parquet schema is stringified into a single key-value pair in the parquet metadata */
function getGeoMetadata(schema) {
    const stringifiedGeoMetadata = schema.metadata.geo;
    if (!stringifiedGeoMetadata) {
        return null;
    }
    try {
        const geoMetadata = JSON.parse(stringifiedGeoMetadata);
        return geoMetadata;
    }
    catch {
        return null;
    }
}
exports.getGeoMetadata = getGeoMetadata;
/**
 * Stores a geoarrow / geoparquet geo metadata object in the schema
 * @note geoarrow / geoparquet geo metadata is a single stringified JSON field
 */
function setGeoMetadata(schema, geoMetadata) {
    const stringifiedGeoMetadata = JSON.stringify(geoMetadata);
    schema.metadata.geo = stringifiedGeoMetadata;
}
exports.setGeoMetadata = setGeoMetadata;
/**
 * Unpacks geo metadata into separate metadata fields (parses the long JSON string)
 * @note geoarrow / parquet schema is stringified into a single key-value pair in the parquet metadata
 */
function unpackGeoMetadata(schema) {
    const geoMetadata = getGeoMetadata(schema);
    if (!geoMetadata) {
        return;
    }
    // Store Parquet Schema Level Metadata
    const { version, primary_column, columns } = geoMetadata;
    if (version) {
        schema.metadata['geo.version'] = version;
    }
    if (primary_column) {
        schema.metadata['geo.primary_column'] = primary_column;
    }
    // store column names as comma separated list
    schema.metadata['geo.columns'] = Object.keys(columns || {}).join('');
    for (const [columnName, columnMetadata] of Object.entries(columns || {})) {
        const field = schema.fields.find((field) => field.name === columnName);
        if (field) {
            if (field.name === primary_column) {
                setFieldMetadata(field, 'geo.primary_field', 'true');
            }
            unpackGeoFieldMetadata(field, columnMetadata);
        }
    }
}
exports.unpackGeoMetadata = unpackGeoMetadata;
function unpackGeoFieldMetadata(field, columnMetadata) {
    for (const [key, value] of Object.entries(columnMetadata || {})) {
        switch (key) {
            case 'geometry_type':
                setFieldMetadata(field, `geo.${key}`, value.join(','));
                break;
            case 'bbox':
            case 'crs':
            case 'edges':
            default:
                setFieldMetadata(field, `geo.${key}`, typeof value === 'string' ? value : JSON.stringify(value));
        }
    }
}
function setFieldMetadata(field, key, value) {
    field.metadata = field.metadata || {};
    field.metadata[key] = value;
}
