import type { Feature, Geometry } from '@loaders.gl/schema';
/**
 * Options for encodeWKB
 */
interface WKBOptions {
    /** Does the GeoJSON input have Z values? */
    hasZ?: boolean;
    /** Does the GeoJSON input have M values? */
    hasM?: boolean;
    /** Spatial reference for input GeoJSON */
    srid?: any;
}
/**
 * Encodes a GeoJSON object into WKB
 * @param geojson A GeoJSON Feature or Geometry
 * @returns string
 */
export default function encodeWKB(geometry: Geometry | Feature, options?: WKBOptions | {
    wkb: WKBOptions;
}): ArrayBuffer;
export {};
//# sourceMappingURL=encode-wkb.d.ts.map