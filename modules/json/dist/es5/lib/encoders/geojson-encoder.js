"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeTableAsGeojsonInBatches = encodeTableAsGeojsonInBatches;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _schema = require("@loaders.gl/schema");
var _encodeUtils = require("./encode-utils");
var _utf8Encoder = require("./utf8-encoder");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
function encodeTableAsGeojsonInBatches(_x) {
  return _encodeTableAsGeojsonInBatches.apply(this, arguments);
}
function _encodeTableAsGeojsonInBatches() {
  _encodeTableAsGeojsonInBatches = (0, _wrapAsyncGenerator2.default)(function (batchIterator) {
    var inputOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _regenerator.default.mark(function _callee() {
      var options, utf8Encoder, geometryColumn, isFirstLine, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, batch, table, start, _batch$end, end, rowIndex, arrayBufferBatch;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            options = _objectSpread({
              geojson: {},
              chunkSize: 10000
            }, inputOpts);
            utf8Encoder = new _utf8Encoder.Utf8ArrayBufferEncoder(options.chunkSize);
            if (!options.geojson.featureArray) {
              utf8Encoder.push('{\n', '"type": "FeatureCollection",\n', '"features":\n');
            }
            utf8Encoder.push('[');
            geometryColumn = options.geojson.geometryColumn;
            isFirstLine = true;
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context.prev = 8;
            _iterator = _asyncIterator(batchIterator);
          case 10:
            _context.next = 12;
            return (0, _awaitAsyncGenerator2.default)(_iterator.next());
          case 12:
            if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
              _context.next = 35;
              break;
            }
            batch = _step.value;
            table = batch.table, start = batch.start, _batch$end = batch.end, end = _batch$end === void 0 ? (0, _schema.getTableLength)(batch.table) - start : _batch$end;
            if (!geometryColumn) {
              geometryColumn = geometryColumn || (0, _encodeUtils.detectGeometryColumnIndex)(table);
            }
            rowIndex = start;
          case 17:
            if (!(rowIndex < end)) {
              _context.next = 28;
              break;
            }
            if (!isFirstLine) {
              utf8Encoder.push(',');
            }
            utf8Encoder.push('\n');
            isFirstLine = false;
            encodeRow(table, rowIndex, geometryColumn, utf8Encoder);
            if (!utf8Encoder.isFull()) {
              _context.next = 25;
              break;
            }
            _context.next = 25;
            return utf8Encoder.getArrayBufferBatch();
          case 25:
            ++rowIndex;
            _context.next = 17;
            break;
          case 28:
            arrayBufferBatch = utf8Encoder.getArrayBufferBatch();
            if (!(arrayBufferBatch.byteLength > 0)) {
              _context.next = 32;
              break;
            }
            _context.next = 32;
            return arrayBufferBatch;
          case 32:
            _iteratorAbruptCompletion = false;
            _context.next = 10;
            break;
          case 35:
            _context.next = 41;
            break;
          case 37:
            _context.prev = 37;
            _context.t0 = _context["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context.t0;
          case 41:
            _context.prev = 41;
            _context.prev = 42;
            if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
              _context.next = 46;
              break;
            }
            _context.next = 46;
            return (0, _awaitAsyncGenerator2.default)(_iterator.return());
          case 46:
            _context.prev = 46;
            if (!_didIteratorError) {
              _context.next = 49;
              break;
            }
            throw _iteratorError;
          case 49:
            return _context.finish(46);
          case 50:
            return _context.finish(41);
          case 51:
            utf8Encoder.push('\n');
            utf8Encoder.push(']\n');
            if (!options.geojson.featureArray) {
              utf8Encoder.push('}');
            }
            _context.next = 56;
            return utf8Encoder.getArrayBufferBatch();
          case 56:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[8, 37, 41, 51], [42,, 46, 50]]);
    })();
  });
  return _encodeTableAsGeojsonInBatches.apply(this, arguments);
}
function encodeRow(table, rowIndex, geometryColumnIndex, utf8Encoder) {
  var row = (0, _schema.getTableRowAsObject)(table, rowIndex);
  if (!row) return;
  var featureWithProperties = getFeatureFromRow(table, row, geometryColumnIndex);
  var featureString = JSON.stringify(featureWithProperties);
  utf8Encoder.push(featureString);
}
function getFeatureFromRow(table, row, geometryColumnIndex) {
  var _table$schema, _featureOrGeometry, _featureOrGeometry2;
  var properties = (0, _encodeUtils.getRowPropertyObject)(table, row, [geometryColumnIndex]);
  var columnName = (_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields[geometryColumnIndex].name;
  var featureOrGeometry = columnName && row[columnName];
  if (!featureOrGeometry) {
    return {
      type: 'Feature',
      geometry: null,
      properties: properties
    };
  }
  if (typeof featureOrGeometry === 'string') {
    try {
      featureOrGeometry = JSON.parse(featureOrGeometry);
    } catch (err) {
      throw new Error('Invalid string geometry');
    }
  }
  if ((0, _typeof2.default)(featureOrGeometry) !== 'object' || typeof ((_featureOrGeometry = featureOrGeometry) === null || _featureOrGeometry === void 0 ? void 0 : _featureOrGeometry.type) !== 'string') {
    throw new Error('invalid geometry column value');
  }
  if (((_featureOrGeometry2 = featureOrGeometry) === null || _featureOrGeometry2 === void 0 ? void 0 : _featureOrGeometry2.type) === 'Feature') {
    return _objectSpread(_objectSpread({}, featureOrGeometry), {}, {
      properties: properties
    });
  }
  return {
    type: 'Feature',
    geometry: featureOrGeometry,
    properties: properties
  };
}
//# sourceMappingURL=geojson-encoder.js.map