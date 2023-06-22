import BinaryWriter from './utils/binary-writer';
var WKB = function (WKB) {
  WKB[WKB["Point"] = 1] = "Point";
  WKB[WKB["LineString"] = 2] = "LineString";
  WKB[WKB["Polygon"] = 3] = "Polygon";
  WKB[WKB["MultiPoint"] = 4] = "MultiPoint";
  WKB[WKB["MultiLineString"] = 5] = "MultiLineString";
  WKB[WKB["MultiPolygon"] = 6] = "MultiPolygon";
  WKB[WKB["GeometryCollection"] = 7] = "GeometryCollection";
  return WKB;
}(WKB || {});
export default function encodeWKB(geometry) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (geometry.type === 'Feature') {
    geometry = geometry.geometry;
  }
  if ('wkb' in options) {
    options = options.wkb;
  }
  switch (geometry.type) {
    case 'Point':
      return encodePoint(geometry.coordinates, options);
    case 'LineString':
      return encodeLineString(geometry.coordinates, options);
    case 'Polygon':
      return encodePolygon(geometry.coordinates, options);
    case 'MultiPoint':
      return encodeMultiPoint(geometry, options);
    case 'MultiPolygon':
      return encodeMultiPolygon(geometry, options);
    case 'MultiLineString':
      return encodeMultiLineString(geometry, options);
    case 'GeometryCollection':
      return encodeGeometryCollection(geometry, options);
    default:
      const exhaustiveCheck = geometry;
      throw new Error("Unhandled case: ".concat(exhaustiveCheck));
  }
}
function getGeometrySize(geometry, options) {
  switch (geometry.type) {
    case 'Point':
      return getPointSize(options);
    case 'LineString':
      return getLineStringSize(geometry.coordinates, options);
    case 'Polygon':
      return getPolygonSize(geometry.coordinates, options);
    case 'MultiPoint':
      return getMultiPointSize(geometry, options);
    case 'MultiPolygon':
      return getMultiPolygonSize(geometry, options);
    case 'MultiLineString':
      return getMultiLineStringSize(geometry, options);
    case 'GeometryCollection':
      return getGeometryCollectionSize(geometry, options);
    default:
      const exhaustiveCheck = geometry;
      throw new Error("Unhandled case: ".concat(exhaustiveCheck));
  }
}
function encodePoint(coordinates, options) {
  const writer = new BinaryWriter(getPointSize(options));
  writer.writeInt8(1);
  writeWkbType(writer, WKB.Point, options);
  if (typeof coordinates[0] === 'undefined' && typeof coordinates[1] === 'undefined') {
    writer.writeDoubleLE(NaN);
    writer.writeDoubleLE(NaN);
    if (options.hasZ) {
      writer.writeDoubleLE(NaN);
    }
    if (options.hasM) {
      writer.writeDoubleLE(NaN);
    }
  } else {
    writeCoordinate(writer, coordinates, options);
  }
  return writer.arrayBuffer;
}
function writeCoordinate(writer, coordinate, options) {
  writer.writeDoubleLE(coordinate[0]);
  writer.writeDoubleLE(coordinate[1]);
  if (options.hasZ) {
    writer.writeDoubleLE(coordinate[2]);
  }
  if (options.hasM) {
    writer.writeDoubleLE(coordinate[3]);
  }
}
function getPointSize(options) {
  const coordinateSize = getCoordinateSize(options);
  return 1 + 4 + coordinateSize;
}
function encodeLineString(coordinates, options) {
  const size = getLineStringSize(coordinates, options);
  const writer = new BinaryWriter(size);
  writer.writeInt8(1);
  writeWkbType(writer, WKB.LineString, options);
  writer.writeUInt32LE(coordinates.length);
  for (const coordinate of coordinates) {
    writeCoordinate(writer, coordinate, options);
  }
  return writer.arrayBuffer;
}
function getLineStringSize(coordinates, options) {
  const coordinateSize = getCoordinateSize(options);
  return 1 + 4 + 4 + coordinates.length * coordinateSize;
}
function encodePolygon(coordinates, options) {
  const writer = new BinaryWriter(getPolygonSize(coordinates, options));
  writer.writeInt8(1);
  writeWkbType(writer, WKB.Polygon, options);
  const [exteriorRing, ...interiorRings] = coordinates;
  if (exteriorRing.length > 0) {
    writer.writeUInt32LE(1 + interiorRings.length);
    writer.writeUInt32LE(exteriorRing.length);
  } else {
    writer.writeUInt32LE(0);
  }
  for (const coordinate of exteriorRing) {
    writeCoordinate(writer, coordinate, options);
  }
  for (const interiorRing of interiorRings) {
    writer.writeUInt32LE(interiorRing.length);
    for (const coordinate of interiorRing) {
      writeCoordinate(writer, coordinate, options);
    }
  }
  return writer.arrayBuffer;
}
function getPolygonSize(coordinates, options) {
  const coordinateSize = getCoordinateSize(options);
  const [exteriorRing, ...interiorRings] = coordinates;
  let size = 1 + 4 + 4;
  if (exteriorRing.length > 0) {
    size += 4 + exteriorRing.length * coordinateSize;
  }
  for (const interiorRing of interiorRings) {
    size += 4 + interiorRing.length * coordinateSize;
  }
  return size;
}
function encodeMultiPoint(multiPoint, options) {
  const writer = new BinaryWriter(getMultiPointSize(multiPoint, options));
  const points = multiPoint.coordinates;
  writer.writeInt8(1);
  writeWkbType(writer, WKB.MultiPoint, options);
  writer.writeUInt32LE(points.length);
  for (const point of points) {
    const arrayBuffer = encodePoint(point, options);
    writer.writeBuffer(arrayBuffer);
  }
  return writer.arrayBuffer;
}
function getMultiPointSize(multiPoint, options) {
  let coordinateSize = getCoordinateSize(options);
  const points = multiPoint.coordinates;
  coordinateSize += 5;
  return 1 + 4 + 4 + points.length * coordinateSize;
}
function encodeMultiLineString(multiLineString, options) {
  const writer = new BinaryWriter(getMultiLineStringSize(multiLineString, options));
  const lineStrings = multiLineString.coordinates;
  writer.writeInt8(1);
  writeWkbType(writer, WKB.MultiLineString, options);
  writer.writeUInt32LE(lineStrings.length);
  for (const lineString of lineStrings) {
    const encodedLineString = encodeLineString(lineString, options);
    writer.writeBuffer(encodedLineString);
  }
  return writer.arrayBuffer;
}
function getMultiLineStringSize(multiLineString, options) {
  let size = 1 + 4 + 4;
  const lineStrings = multiLineString.coordinates;
  for (const lineString of lineStrings) {
    size += getLineStringSize(lineString, options);
  }
  return size;
}
function encodeMultiPolygon(multiPolygon, options) {
  const writer = new BinaryWriter(getMultiPolygonSize(multiPolygon, options));
  const polygons = multiPolygon.coordinates;
  writer.writeInt8(1);
  writeWkbType(writer, WKB.MultiPolygon, options);
  writer.writeUInt32LE(polygons.length);
  for (const polygon of polygons) {
    const encodedPolygon = encodePolygon(polygon, options);
    writer.writeBuffer(encodedPolygon);
  }
  return writer.arrayBuffer;
}
function getMultiPolygonSize(multiPolygon, options) {
  let size = 1 + 4 + 4;
  const polygons = multiPolygon.coordinates;
  for (const polygon of polygons) {
    size += getPolygonSize(polygon, options);
  }
  return size;
}
function encodeGeometryCollection(collection, options) {
  const writer = new BinaryWriter(getGeometryCollectionSize(collection, options));
  writer.writeInt8(1);
  writeWkbType(writer, WKB.GeometryCollection, options);
  writer.writeUInt32LE(collection.geometries.length);
  for (const geometry of collection.geometries) {
    const arrayBuffer = encodeWKB(geometry, options);
    writer.writeBuffer(arrayBuffer);
  }
  return writer.arrayBuffer;
}
function getGeometryCollectionSize(collection, options) {
  let size = 1 + 4 + 4;
  for (const geometry of collection.geometries) {
    size += getGeometrySize(geometry, options);
  }
  return size;
}
function writeWkbType(writer, geometryType, options) {
  const {
    hasZ,
    hasM,
    srid
  } = options;
  let dimensionType = 0;
  if (!srid) {
    if (hasZ && hasM) {
      dimensionType += 3000;
    } else if (hasZ) {
      dimensionType += 1000;
    } else if (hasM) {
      dimensionType += 2000;
    }
  } else {
    if (hasZ) {
      dimensionType |= 0x80000000;
    }
    if (hasM) {
      dimensionType |= 0x40000000;
    }
  }
  writer.writeUInt32LE(dimensionType + geometryType >>> 0);
}
function getCoordinateSize(options) {
  let coordinateSize = 16;
  if (options.hasZ) {
    coordinateSize += 8;
  }
  if (options.hasM) {
    coordinateSize += 8;
  }
  return coordinateSize;
}
//# sourceMappingURL=encode-wkb.js.map