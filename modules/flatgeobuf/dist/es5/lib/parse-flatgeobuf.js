"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFlatGeobuf = parseFlatGeobuf;
exports.parseFlatGeobufInBatches = parseFlatGeobufInBatches;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _proj = require("@math.gl/proj4");
var _gis = require("@loaders.gl/gis");
var _geojson = require("flatgeobuf/lib/cjs/geojson");
var _generic = require("flatgeobuf/lib/cjs/generic");
var _feature = require("flatgeobuf/lib/cjs/generic/feature");
var _binaryGeometries = require("./binary-geometries");
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
function binaryFromFeature(feature, header) {
  var geometry = feature.geometry();
  var geometryType = header.geometryType || geometry.type();
  var parsedGeometry = (0, _binaryGeometries.fromGeometry)(geometry, geometryType);
  parsedGeometry.properties = (0, _feature.parseProperties)(feature, header.columns);
  return parsedGeometry;
}
function parseFlatGeobuf(arrayBuffer, options) {
  var _options$gis, _options$flatgeobuf;
  var shape = (options === null || options === void 0 ? void 0 : (_options$gis = options.gis) === null || _options$gis === void 0 ? void 0 : _options$gis.format) || (options === null || options === void 0 ? void 0 : (_options$flatgeobuf = options.flatgeobuf) === null || _options$flatgeobuf === void 0 ? void 0 : _options$flatgeobuf.shape);
  switch (shape) {
    case 'geojson-row-table':
      {
        var table = {
          shape: 'geojson-row-table',
          data: parseFlatGeobufToGeoJSON(arrayBuffer, options)
        };
        return table;
      }
    case 'columnar-table':
      return {
        shape: 'columnar-table',
        data: parseFlatGeobufToBinary(arrayBuffer, options)
      };
    case 'geojson':
      return parseFlatGeobufToGeoJSON(arrayBuffer, options);
    case 'binary':
      return parseFlatGeobufToBinary(arrayBuffer, options);
    default:
      throw new Error(shape);
  }
}
function parseFlatGeobufToBinary(arrayBuffer, options) {
  var array = new Uint8Array(arrayBuffer);
  return (0, _generic.deserialize)(array, binaryFromFeature);
}
function parseFlatGeobufToGeoJSON(arrayBuffer, options) {
  if (arrayBuffer.byteLength === 0) {
    return [];
  }
  var _ref = options && options.gis || {},
    _ref$reproject = _ref.reproject,
    reproject = _ref$reproject === void 0 ? false : _ref$reproject,
    _ref$_targetCrs = _ref._targetCrs,
    _targetCrs = _ref$_targetCrs === void 0 ? 'WGS84' : _ref$_targetCrs;
  var arr = new Uint8Array(arrayBuffer);
  var headerMeta;
  var _deserializeGeoJson = (0, _geojson.deserialize)(arr, false, function (header) {
      headerMeta = header;
    }),
    features = _deserializeGeoJson.features;
  var crs = headerMeta && headerMeta.crs;
  var projection;
  if (reproject && crs) {
    try {
      projection = new _proj.Proj4Projection({
        from: crs.wkt,
        to: _targetCrs
      });
    } catch (e) {}
  }
  if (projection) {
    return (0, _gis.transformGeoJsonCoords)(features, function (coords) {
      return projection.project(coords);
    });
  }
  return features;
}
function parseFlatGeobufInBatches(stream, options) {
  if (options && options.gis && options.gis.format === 'binary') {
    return parseFlatGeobufInBatchesToBinary(stream, options);
  }
  return parseFlatGeobufInBatchesToGeoJSON(stream, options);
}
function parseFlatGeobufInBatchesToBinary(stream, options) {
  var iterator = (0, _generic.deserialize)(stream, binaryFromFeature);
  return iterator;
}
function parseFlatGeobufInBatchesToGeoJSON(_x, _x2) {
  return _parseFlatGeobufInBatchesToGeoJSON.apply(this, arguments);
}
function _parseFlatGeobufInBatchesToGeoJSON() {
  _parseFlatGeobufInBatchesToGeoJSON = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(stream, options) {
    var _ref2, _ref2$reproject, reproject, _ref2$_targetCrs, _targetCrs, headerMeta, iterator, projection, firstRecord, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, feature, crs;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _ref2 = options && options.gis || {}, _ref2$reproject = _ref2.reproject, reproject = _ref2$reproject === void 0 ? false : _ref2$reproject, _ref2$_targetCrs = _ref2._targetCrs, _targetCrs = _ref2$_targetCrs === void 0 ? 'WGS84' : _ref2$_targetCrs;
          iterator = (0, _geojson.deserialize)(stream, false, function (header) {
            headerMeta = header;
          });
          firstRecord = true;
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context.prev = 5;
          _iterator = _asyncIterator(iterator);
        case 7:
          _context.next = 9;
          return (0, _awaitAsyncGenerator2.default)(_iterator.next());
        case 9:
          if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
            _context.next = 22;
            break;
          }
          feature = _step.value;
          if (firstRecord) {
            crs = headerMeta && headerMeta.crs;
            if (reproject && crs) {
              projection = new _proj.Proj4Projection({
                from: crs.wkt,
                to: _targetCrs
              });
            }
            firstRecord = false;
          }
          if (!(reproject && projection)) {
            _context.next = 17;
            break;
          }
          _context.next = 15;
          return (0, _gis.transformGeoJsonCoords)([feature], function (coords) {
            return projection.project(coords);
          });
        case 15:
          _context.next = 19;
          break;
        case 17:
          _context.next = 19;
          return feature;
        case 19:
          _iteratorAbruptCompletion = false;
          _context.next = 7;
          break;
        case 22:
          _context.next = 28;
          break;
        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context.t0;
        case 28:
          _context.prev = 28;
          _context.prev = 29;
          if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
            _context.next = 33;
            break;
          }
          _context.next = 33;
          return (0, _awaitAsyncGenerator2.default)(_iterator.return());
        case 33:
          _context.prev = 33;
          if (!_didIteratorError) {
            _context.next = 36;
            break;
          }
          throw _iteratorError;
        case 36:
          return _context.finish(33);
        case 37:
          return _context.finish(28);
        case 38:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 24, 28, 38], [29,, 33, 37]]);
  }));
  return _parseFlatGeobufInBatchesToGeoJSON.apply(this, arguments);
}
//# sourceMappingURL=parse-flatgeobuf.js.map