"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Stringifies a GeoJSON object into WKT
 * @param geojson
 * @returns string
 */
function encodeWKT(geometry) {
    if (geometry.type === 'Feature') {
        geometry = geometry.geometry;
    }
    switch (geometry.type) {
        case 'Point':
            return `POINT ${wrapParens(pairWKT(geometry.coordinates))}`;
        case 'LineString':
            return `LINESTRING ${wrapParens(ringWKT(geometry.coordinates))}`;
        case 'Polygon':
            return `POLYGON ${wrapParens(ringsWKT(geometry.coordinates))}`;
        case 'MultiPoint':
            return `MULTIPOINT ${wrapParens(ringWKT(geometry.coordinates))}`;
        case 'MultiPolygon':
            return `MULTIPOLYGON ${wrapParens(multiRingsWKT(geometry.coordinates))}`;
        case 'MultiLineString':
            return `MULTILINESTRING ${wrapParens(ringsWKT(geometry.coordinates))}`;
        case 'GeometryCollection':
            return `GEOMETRYCOLLECTION ${wrapParens(geometry.geometries.map(encodeWKT).join(', '))}`;
        default:
            throw new Error('stringify requires a valid GeoJSON Feature or geometry object as input');
    }
}
exports.default = encodeWKT;
function pairWKT(c) {
    return c.join(' ');
}
function ringWKT(r) {
    return r.map(pairWKT).join(', ');
}
function ringsWKT(r) {
    return r.map(ringWKT).map(wrapParens).join(', ');
}
function multiRingsWKT(r) {
    return r.map(ringsWKT).map(wrapParens).join(', ');
}
function wrapParens(s) {
    return `(${s})`;
}
