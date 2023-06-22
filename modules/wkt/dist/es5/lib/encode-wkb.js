"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = encodeWKB;
var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));
var _binaryWriter = _interopRequireDefault(require("./utils/binary-writer"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
function encodeWKB(geometry) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
      var exhaustiveCheck = geometry;
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
      var exhaustiveCheck = geometry;
      throw new Error("Unhandled case: ".concat(exhaustiveCheck));
  }
}
function encodePoint(coordinates, options) {
  var writer = new _binaryWriter.default(getPointSize(options));
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
  var coordinateSize = getCoordinateSize(options);
  return 1 + 4 + coordinateSize;
}
function encodeLineString(coordinates, options) {
  var size = getLineStringSize(coordinates, options);
  var writer = new _binaryWriter.default(size);
  writer.writeInt8(1);
  writeWkbType(writer, WKB.LineString, options);
  writer.writeUInt32LE(coordinates.length);
  var _iterator = _createForOfIteratorHelper(coordinates),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var coordinate = _step.value;
      writeCoordinate(writer, coordinate, options);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return writer.arrayBuffer;
}
function getLineStringSize(coordinates, options) {
  var coordinateSize = getCoordinateSize(options);
  return 1 + 4 + 4 + coordinates.length * coordinateSize;
}
function encodePolygon(coordinates, options) {
  var writer = new _binaryWriter.default(getPolygonSize(coordinates, options));
  writer.writeInt8(1);
  writeWkbType(writer, WKB.Polygon, options);
  var _coordinates = (0, _toArray2.default)(coordinates),
    exteriorRing = _coordinates[0],
    interiorRings = _coordinates.slice(1);
  if (exteriorRing.length > 0) {
    writer.writeUInt32LE(1 + interiorRings.length);
    writer.writeUInt32LE(exteriorRing.length);
  } else {
    writer.writeUInt32LE(0);
  }
  var _iterator2 = _createForOfIteratorHelper(exteriorRing),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var coordinate = _step2.value;
      writeCoordinate(writer, coordinate, options);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var _iterator3 = _createForOfIteratorHelper(interiorRings),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var interiorRing = _step3.value;
      writer.writeUInt32LE(interiorRing.length);
      var _iterator4 = _createForOfIteratorHelper(interiorRing),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _coordinate = _step4.value;
          writeCoordinate(writer, _coordinate, options);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return writer.arrayBuffer;
}
function getPolygonSize(coordinates, options) {
  var coordinateSize = getCoordinateSize(options);
  var _coordinates2 = (0, _toArray2.default)(coordinates),
    exteriorRing = _coordinates2[0],
    interiorRings = _coordinates2.slice(1);
  var size = 1 + 4 + 4;
  if (exteriorRing.length > 0) {
    size += 4 + exteriorRing.length * coordinateSize;
  }
  var _iterator5 = _createForOfIteratorHelper(interiorRings),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var interiorRing = _step5.value;
      size += 4 + interiorRing.length * coordinateSize;
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return size;
}
function encodeMultiPoint(multiPoint, options) {
  var writer = new _binaryWriter.default(getMultiPointSize(multiPoint, options));
  var points = multiPoint.coordinates;
  writer.writeInt8(1);
  writeWkbType(writer, WKB.MultiPoint, options);
  writer.writeUInt32LE(points.length);
  var _iterator6 = _createForOfIteratorHelper(points),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var point = _step6.value;
      var arrayBuffer = encodePoint(point, options);
      writer.writeBuffer(arrayBuffer);
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  return writer.arrayBuffer;
}
function getMultiPointSize(multiPoint, options) {
  var coordinateSize = getCoordinateSize(options);
  var points = multiPoint.coordinates;
  coordinateSize += 5;
  return 1 + 4 + 4 + points.length * coordinateSize;
}
function encodeMultiLineString(multiLineString, options) {
  var writer = new _binaryWriter.default(getMultiLineStringSize(multiLineString, options));
  var lineStrings = multiLineString.coordinates;
  writer.writeInt8(1);
  writeWkbType(writer, WKB.MultiLineString, options);
  writer.writeUInt32LE(lineStrings.length);
  var _iterator7 = _createForOfIteratorHelper(lineStrings),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var lineString = _step7.value;
      var encodedLineString = encodeLineString(lineString, options);
      writer.writeBuffer(encodedLineString);
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  return writer.arrayBuffer;
}
function getMultiLineStringSize(multiLineString, options) {
  var size = 1 + 4 + 4;
  var lineStrings = multiLineString.coordinates;
  var _iterator8 = _createForOfIteratorHelper(lineStrings),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var lineString = _step8.value;
      size += getLineStringSize(lineString, options);
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  return size;
}
function encodeMultiPolygon(multiPolygon, options) {
  var writer = new _binaryWriter.default(getMultiPolygonSize(multiPolygon, options));
  var polygons = multiPolygon.coordinates;
  writer.writeInt8(1);
  writeWkbType(writer, WKB.MultiPolygon, options);
  writer.writeUInt32LE(polygons.length);
  var _iterator9 = _createForOfIteratorHelper(polygons),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var polygon = _step9.value;
      var encodedPolygon = encodePolygon(polygon, options);
      writer.writeBuffer(encodedPolygon);
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  return writer.arrayBuffer;
}
function getMultiPolygonSize(multiPolygon, options) {
  var size = 1 + 4 + 4;
  var polygons = multiPolygon.coordinates;
  var _iterator10 = _createForOfIteratorHelper(polygons),
    _step10;
  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var polygon = _step10.value;
      size += getPolygonSize(polygon, options);
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
  return size;
}
function encodeGeometryCollection(collection, options) {
  var writer = new _binaryWriter.default(getGeometryCollectionSize(collection, options));
  writer.writeInt8(1);
  writeWkbType(writer, WKB.GeometryCollection, options);
  writer.writeUInt32LE(collection.geometries.length);
  var _iterator11 = _createForOfIteratorHelper(collection.geometries),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var geometry = _step11.value;
      var arrayBuffer = encodeWKB(geometry, options);
      writer.writeBuffer(arrayBuffer);
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  return writer.arrayBuffer;
}
function getGeometryCollectionSize(collection, options) {
  var size = 1 + 4 + 4;
  var _iterator12 = _createForOfIteratorHelper(collection.geometries),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var geometry = _step12.value;
      size += getGeometrySize(geometry, options);
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }
  return size;
}
function writeWkbType(writer, geometryType, options) {
  var hasZ = options.hasZ,
    hasM = options.hasM,
    srid = options.srid;
  var dimensionType = 0;
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
  var coordinateSize = 16;
  if (options.hasZ) {
    coordinateSize += 8;
  }
  if (options.hasM) {
    coordinateSize += 8;
  }
  return coordinateSize;
}
//# sourceMappingURL=encode-wkb.js.map