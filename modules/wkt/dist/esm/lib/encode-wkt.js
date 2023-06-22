export default function encodeWKT(geometry) {
  if (geometry.type === 'Feature') {
    geometry = geometry.geometry;
  }
  switch (geometry.type) {
    case 'Point':
      return "POINT ".concat(wrapParens(pairWKT(geometry.coordinates)));
    case 'LineString':
      return "LINESTRING ".concat(wrapParens(ringWKT(geometry.coordinates)));
    case 'Polygon':
      return "POLYGON ".concat(wrapParens(ringsWKT(geometry.coordinates)));
    case 'MultiPoint':
      return "MULTIPOINT ".concat(wrapParens(ringWKT(geometry.coordinates)));
    case 'MultiPolygon':
      return "MULTIPOLYGON ".concat(wrapParens(multiRingsWKT(geometry.coordinates)));
    case 'MultiLineString':
      return "MULTILINESTRING ".concat(wrapParens(ringsWKT(geometry.coordinates)));
    case 'GeometryCollection':
      return "GEOMETRYCOLLECTION ".concat(wrapParens(geometry.geometries.map(encodeWKT).join(', ')));
    default:
      throw new Error('stringify requires a valid GeoJSON Feature or geometry object as input');
  }
}
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
  return "(".concat(s, ")");
}
//# sourceMappingURL=encode-wkt.js.map