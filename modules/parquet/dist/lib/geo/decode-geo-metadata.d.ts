import { Schema } from '@loaders.gl/schema';
/** A geoarrow / geoparquet geo metadata object (stored in stringified form in the top level metadata 'geo' key) */
export type GeoMetadata = {
    version?: string;
    primary_column?: string;
    columns: Record<string, GeoColumnMetadata>;
    [key: string]: unknown;
};
/** A geoarrow / geoparquet geo metadata for one geometry column  */
export type GeoColumnMetadata = {
    bounding_box?: [number, number, number, number] | [number, number, number, number, number, number];
    crs?: string;
    geometry_type?: string[];
    edges?: string;
    [key: string]: unknown;
};
/**
 * Reads the GeoMetadata object from the metadata
 * @note geoarrow / parquet schema is stringified into a single key-value pair in the parquet metadata */
export declare function getGeoMetadata(schema: Schema): GeoMetadata | null;
/**
 * Stores a geoarrow / geoparquet geo metadata object in the schema
 * @note geoarrow / geoparquet geo metadata is a single stringified JSON field
 */
export declare function setGeoMetadata(schema: Schema, geoMetadata: GeoMetadata): void;
/**
 * Unpacks geo metadata into separate metadata fields (parses the long JSON string)
 * @note geoarrow / parquet schema is stringified into a single key-value pair in the parquet metadata
 */
export declare function unpackGeoMetadata(schema: Schema): void;
//# sourceMappingURL=decode-geo-metadata.d.ts.map