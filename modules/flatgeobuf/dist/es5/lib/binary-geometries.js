"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromGeometry = fromGeometry;
var _header_generated = require("flatgeobuf/lib/cjs/header_generated");
function parsePoint(geometry) {
  var xy = geometry.xyArray();
  var z = geometry.zArray();
  var positions = blitArrays(xy, z);
  return {
    positions: positions
  };
}
function parseLines(geometry) {
  var xy = geometry.xyArray();
  var z = geometry.zArray();
  var positions = blitArrays(xy, z);
  var ends = geometry.endsArray() && Array.from(geometry.endsArray()) || [xy.length / 2];
  ends.unshift(0);
  var pathIndices = {
    value: new Uint16Array(ends),
    size: 1
  };
  return {
    positions: positions,
    pathIndices: pathIndices
  };
}
function parsePolygons(geometry) {
  var xy = geometry.xyArray();
  var z = geometry.zArray();
  var positions = blitArrays(xy, z);
  var ends = geometry.endsArray() && Array.from(geometry.endsArray()) || [xy.length / 2];
  ends.unshift(0);
  var primitivePolygonIndices = {
    value: new Uint16Array(ends),
    size: 1
  };
  var polygonIndices = {
    value: new Uint16Array([0, xy.length / 2]),
    size: 1
  };
  return {
    positions: positions,
    primitivePolygonIndices: primitivePolygonIndices,
    polygonIndices: polygonIndices
  };
}
function parseMultiPolygons(geometry) {
  var parsedParts = [];
  var nPositions = 0;
  var nPrimitivePolygonIndices = 1;
  var nPolygonIndices = 1;
  for (var i = 0; i < geometry.partsLength(); i++) {
    var part = geometry.parts(i);
    var polygon = parsePolygons(part);
    nPositions += polygon.positions.value.length;
    nPrimitivePolygonIndices += polygon.primitivePolygonIndices.value.length - 1;
    nPolygonIndices += polygon.polygonIndices.value.length - 1;
    parsedParts.push(polygon);
  }
  var concatPositions = new Float64Array(nPositions);
  var concatPrimitivePolygonIndices = new Uint32Array(nPrimitivePolygonIndices);
  var concatPolygonIndices = new Uint32Array(nPolygonIndices);
  var positionCounter = 0;
  var primitivePolygonIndicesCounter = 1;
  var polygonIndicesCounter = 1;
  var positionSize = parsedParts[0].positions.size;
  for (var _i = 0, _parsedParts = parsedParts; _i < _parsedParts.length; _i++) {
    var parsedPart = _parsedParts[_i];
    concatPositions.set(parsedPart.positions.value, positionCounter * positionSize);
    concatPrimitivePolygonIndices.set(parsedPart.primitivePolygonIndices.value.subarray(1).map(function (x) {
      return x + positionCounter;
    }), primitivePolygonIndicesCounter);
    concatPolygonIndices.set(parsedPart.polygonIndices.value.subarray(1).map(function (x) {
      return x + positionCounter;
    }), polygonIndicesCounter);
    positionCounter += parsedPart.positions.value.length / positionSize;
    primitivePolygonIndicesCounter += parsedPart.primitivePolygonIndices.value.length - 1;
    polygonIndicesCounter += parsedPart.polygonIndices.value.length - 1;
  }
  return {
    positions: {
      value: concatPositions,
      size: positionSize
    },
    primitivePolygonIndices: {
      value: concatPrimitivePolygonIndices,
      size: 1
    },
    polygonIndices: {
      value: concatPolygonIndices,
      size: 1
    }
  };
}
function blitArrays(xy, z) {
  if (!z) {
    return {
      value: xy,
      size: 2
    };
  }
  if (z.length * 2 !== xy.length) {
    throw new Error('Z array must be half XY array\'s length');
  }
  var totalLength = xy.length + z.length;
  var xyz = new Float64Array(totalLength);
  for (var i = 0; i < xy.length / 2; i++) {
    xyz[i * 3 + 0] = xy[i * 2 + 0];
    xyz[i * 3 + 1] = xy[i * 2 + 1];
    xyz[i * 3 + 2] = z[i];
  }
  return {
    value: xyz,
    size: 3
  };
}
function fromGeometry(geometry, type) {
  switch (type) {
    case _header_generated.GeometryType.Point:
    case _header_generated.GeometryType.MultiPoint:
      return parsePoint(geometry);
    case _header_generated.GeometryType.LineString:
    case _header_generated.GeometryType.MultiLineString:
      return parseLines(geometry);
    case _header_generated.GeometryType.Polygon:
      return parsePolygons(geometry);
    case _header_generated.GeometryType.MultiPolygon:
      return parseMultiPolygons(geometry);
    default:
      throw new Error("Unimplemented geometry type: ".concat(type));
  }
}
//# sourceMappingURL=binary-geometries.js.map