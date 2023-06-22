"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseWKB;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var NUM_DIMENSIONS = {
  0: 2,
  1: 3,
  2: 3,
  3: 4
};
function parseWKB(arrayBuffer) {
  var view = new DataView(arrayBuffer);
  var offset = 0;
  var littleEndian = view.getUint8(offset) === 1;
  offset++;
  var geometryCode = view.getUint32(offset, littleEndian);
  offset += 4;
  var geometryType = geometryCode % 1000;
  var type = (geometryCode - geometryType) / 1000;
  var dimension = NUM_DIMENSIONS[type];
  switch (geometryType) {
    case 1:
      var point = parsePoint(view, offset, dimension, littleEndian);
      return point.geometry;
    case 2:
      var line = parseLineString(view, offset, dimension, littleEndian);
      return line.geometry;
    case 3:
      var polygon = parsePolygon(view, offset, dimension, littleEndian);
      return polygon.geometry;
    case 4:
      var multiPoint = parseMultiPoint(view, offset, dimension, littleEndian);
      multiPoint.type = 'Point';
      return multiPoint;
    case 5:
      var multiLine = parseMultiLineString(view, offset, dimension, littleEndian);
      multiLine.type = 'LineString';
      return multiLine;
    case 6:
      var multiPolygon = parseMultiPolygon(view, offset, dimension, littleEndian);
      multiPolygon.type = 'Polygon';
      return multiPolygon;
    default:
      throw new Error("WKB: Unsupported geometry type: ".concat(geometryType));
  }
}
function parsePoint(view, offset, dimension, littleEndian) {
  var positions = new Float64Array(dimension);
  for (var i = 0; i < dimension; i++) {
    positions[i] = view.getFloat64(offset, littleEndian);
    offset += 8;
  }
  return {
    geometry: {
      type: 'Point',
      positions: {
        value: positions,
        size: dimension
      }
    },
    offset: offset
  };
}
function parseLineString(view, offset, dimension, littleEndian) {
  var nPoints = view.getUint32(offset, littleEndian);
  offset += 4;
  var positions = new Float64Array(nPoints * dimension);
  for (var i = 0; i < nPoints * dimension; i++) {
    positions[i] = view.getFloat64(offset, littleEndian);
    offset += 8;
  }
  var pathIndices = [0];
  if (nPoints > 0) {
    pathIndices.push(nPoints);
  }
  return {
    geometry: {
      type: 'LineString',
      positions: {
        value: positions,
        size: dimension
      },
      pathIndices: {
        value: new Uint16Array(pathIndices),
        size: 1
      }
    },
    offset: offset
  };
}
var cumulativeSum = function cumulativeSum(sum) {
  return function (value) {
    return sum += value;
  };
};
function parsePolygon(view, offset, dimension, littleEndian) {
  var nRings = view.getUint32(offset, littleEndian);
  offset += 4;
  var rings = [];
  for (var i = 0; i < nRings; i++) {
    var parsed = parseLineString(view, offset, dimension, littleEndian);
    var positions = parsed.geometry.positions;
    offset = parsed.offset;
    rings.push(positions.value);
  }
  var concatenatedPositions = new Float64Array(concatTypedArrays(rings).buffer);
  var polygonIndices = [0];
  if (concatenatedPositions.length > 0) {
    polygonIndices.push(concatenatedPositions.length / dimension);
  }
  var primitivePolygonIndices = rings.map(function (l) {
    return l.length / dimension;
  }).map(cumulativeSum(0));
  primitivePolygonIndices.unshift(0);
  return {
    geometry: {
      type: 'Polygon',
      positions: {
        value: concatenatedPositions,
        size: dimension
      },
      polygonIndices: {
        value: new Uint16Array(polygonIndices),
        size: 1
      },
      primitivePolygonIndices: {
        value: new Uint16Array(primitivePolygonIndices),
        size: 1
      }
    },
    offset: offset
  };
}
function parseMultiPoint(view, offset, dimension, littleEndian) {
  var nPoints = view.getUint32(offset, littleEndian);
  offset += 4;
  var binaryPointGeometries = [];
  for (var i = 0; i < nPoints; i++) {
    var littleEndianPoint = view.getUint8(offset) === 1;
    offset++;
    if (view.getUint32(offset, littleEndianPoint) % 1000 !== 1) {
      throw new Error('WKB: Inner geometries of MultiPoint not of type Point');
    }
    offset += 4;
    var parsed = parsePoint(view, offset, dimension, littleEndianPoint);
    offset = parsed.offset;
    binaryPointGeometries.push(parsed.geometry);
  }
  return concatenateBinaryPointGeometries(binaryPointGeometries, dimension);
}
function parseMultiLineString(view, offset, dimension, littleEndian) {
  var nLines = view.getUint32(offset, littleEndian);
  offset += 4;
  var binaryLineGeometries = [];
  for (var i = 0; i < nLines; i++) {
    var littleEndianLine = view.getUint8(offset) === 1;
    offset++;
    if (view.getUint32(offset, littleEndianLine) % 1000 !== 2) {
      throw new Error('WKB: Inner geometries of MultiLineString not of type LineString');
    }
    offset += 4;
    var parsed = parseLineString(view, offset, dimension, littleEndianLine);
    offset = parsed.offset;
    binaryLineGeometries.push(parsed.geometry);
  }
  return concatenateBinaryLineGeometries(binaryLineGeometries, dimension);
}
function parseMultiPolygon(view, offset, dimension, littleEndian) {
  var nPolygons = view.getUint32(offset, littleEndian);
  offset += 4;
  var binaryPolygonGeometries = [];
  for (var i = 0; i < nPolygons; i++) {
    var littleEndianPolygon = view.getUint8(offset) === 1;
    offset++;
    if (view.getUint32(offset, littleEndianPolygon) % 1000 !== 3) {
      throw new Error('WKB: Inner geometries of MultiPolygon not of type Polygon');
    }
    offset += 4;
    var parsed = parsePolygon(view, offset, dimension, littleEndianPolygon);
    offset = parsed.offset;
    binaryPolygonGeometries.push(parsed.geometry);
  }
  return concatenateBinaryPolygonGeometries(binaryPolygonGeometries, dimension);
}
function concatenateBinaryPointGeometries(binaryPointGeometries, dimension) {
  var positions = binaryPointGeometries.map(function (geometry) {
    return geometry.positions.value;
  });
  var concatenatedPositions = new Float64Array(concatTypedArrays(positions).buffer);
  return {
    type: 'Point',
    positions: {
      value: concatenatedPositions,
      size: dimension
    }
  };
}
function concatenateBinaryLineGeometries(binaryLineGeometries, dimension) {
  var lines = binaryLineGeometries.map(function (geometry) {
    return geometry.positions.value;
  });
  var concatenatedPositions = new Float64Array(concatTypedArrays(lines).buffer);
  var pathIndices = lines.map(function (line) {
    return line.length / dimension;
  }).map(cumulativeSum(0));
  pathIndices.unshift(0);
  return {
    type: 'LineString',
    positions: {
      value: concatenatedPositions,
      size: dimension
    },
    pathIndices: {
      value: new Uint16Array(pathIndices),
      size: 1
    }
  };
}
function concatenateBinaryPolygonGeometries(binaryPolygonGeometries, dimension) {
  var polygons = [];
  var primitivePolygons = [];
  var _iterator = _createForOfIteratorHelper(binaryPolygonGeometries),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var binaryPolygon = _step.value;
      var positions = binaryPolygon.positions,
        _primitivePolygonIndices = binaryPolygon.primitivePolygonIndices;
      polygons.push(positions.value);
      primitivePolygons.push(_primitivePolygonIndices.value);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var concatenatedPositions = new Float64Array(concatTypedArrays(polygons).buffer);
  var polygonIndices = polygons.map(function (p) {
    return p.length / dimension;
  }).map(cumulativeSum(0));
  polygonIndices.unshift(0);
  var primitivePolygonIndices = [0];
  for (var _i = 0, _primitivePolygons = primitivePolygons; _i < _primitivePolygons.length; _i++) {
    var primitivePolygon = _primitivePolygons[_i];
    primitivePolygonIndices.push.apply(primitivePolygonIndices, (0, _toConsumableArray2.default)(primitivePolygon.filter(function (x) {
      return x > 0;
    }).map(function (x) {
      return x + primitivePolygonIndices[primitivePolygonIndices.length - 1];
    })));
  }
  return {
    type: 'Polygon',
    positions: {
      value: concatenatedPositions,
      size: dimension
    },
    polygonIndices: {
      value: new Uint16Array(polygonIndices),
      size: 1
    },
    primitivePolygonIndices: {
      value: new Uint16Array(primitivePolygonIndices),
      size: 1
    }
  };
}
function concatTypedArrays(arrays) {
  var byteLength = 0;
  for (var i = 0; i < arrays.length; ++i) {
    byteLength += arrays[i].byteLength;
  }
  var buffer = new Uint8Array(byteLength);
  var byteOffset = 0;
  for (var _i2 = 0; _i2 < arrays.length; ++_i2) {
    var data = new Uint8Array(arrays[_i2].buffer);
    byteLength = data.length;
    for (var j = 0; j < byteLength; ++j) {
      buffer[byteOffset++] = data[j];
    }
  }
  return buffer;
}
//# sourceMappingURL=parse-wkb.js.map