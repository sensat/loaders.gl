"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseParquetFileInColumnarBatches = parseParquetFileInColumnarBatches;
exports.parseParquetInColumns = parseParquetInColumns;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _loaderUtils = require("@loaders.gl/loader-utils");
var _parquetReader = require("../../parquetjs/parser/parquet-reader");
var _convertSchemaFromParquet = require("../arrow/convert-schema-from-parquet");
var _shred = require("../../parquetjs/schema/shred");
var _decodeGeoMetadata = require("../geo/decode-geo-metadata");
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
function parseParquetInColumns(_x3, _x4) {
  return _parseParquetInColumns.apply(this, arguments);
}
function _parseParquetInColumns() {
  _parseParquetInColumns = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, options) {
    var blob, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, batch;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          blob = new Blob([arrayBuffer]);
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context2.prev = 3;
          _iterator = _asyncIterator(parseParquetFileInColumnarBatches(blob, options));
        case 5:
          _context2.next = 7;
          return _iterator.next();
        case 7:
          if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
            _context2.next = 13;
            break;
          }
          batch = _step.value;
          return _context2.abrupt("return", {
            shape: 'columnar-table',
            schema: batch.schema,
            data: batch.data
          });
        case 10:
          _iteratorAbruptCompletion = false;
          _context2.next = 5;
          break;
        case 13:
          _context2.next = 19;
          break;
        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context2.t0;
        case 19:
          _context2.prev = 19;
          _context2.prev = 20;
          if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
            _context2.next = 24;
            break;
          }
          _context2.next = 24;
          return _iterator.return();
        case 24:
          _context2.prev = 24;
          if (!_didIteratorError) {
            _context2.next = 27;
            break;
          }
          throw _iteratorError;
        case 27:
          return _context2.finish(24);
        case 28:
          return _context2.finish(19);
        case 29:
          throw new Error('empty table');
        case 30:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 15, 19, 29], [20,, 24, 28]]);
  }));
  return _parseParquetInColumns.apply(this, arguments);
}
function parseParquetFileInColumnarBatches(_x, _x2) {
  return _parseParquetFileInColumnarBatches.apply(this, arguments);
}
function _parseParquetFileInColumnarBatches() {
  _parseParquetFileInColumnarBatches = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(blob, options) {
    var file, reader, parquetSchema, parquetMetadata, schema, rowGroups, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, rowGroup;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          file = (0, _loaderUtils.makeReadableFile)(blob);
          reader = new _parquetReader.ParquetReader(file);
          _context.next = 4;
          return (0, _awaitAsyncGenerator2.default)(reader.getSchema());
        case 4:
          parquetSchema = _context.sent;
          _context.next = 7;
          return (0, _awaitAsyncGenerator2.default)(reader.getFileMetadata());
        case 7:
          parquetMetadata = _context.sent;
          schema = (0, _convertSchemaFromParquet.convertParquetSchema)(parquetSchema, parquetMetadata);
          (0, _decodeGeoMetadata.unpackGeoMetadata)(schema);
          rowGroups = reader.rowGroupIterator(options === null || options === void 0 ? void 0 : options.parquet);
          _iteratorAbruptCompletion2 = false;
          _didIteratorError2 = false;
          _context.prev = 13;
          _iterator2 = _asyncIterator(rowGroups);
        case 15:
          _context.next = 17;
          return (0, _awaitAsyncGenerator2.default)(_iterator2.next());
        case 17:
          if (!(_iteratorAbruptCompletion2 = !(_step2 = _context.sent).done)) {
            _context.next = 24;
            break;
          }
          rowGroup = _step2.value;
          _context.next = 21;
          return convertRowGroupToTableBatch(parquetSchema, rowGroup, schema);
        case 21:
          _iteratorAbruptCompletion2 = false;
          _context.next = 15;
          break;
        case 24:
          _context.next = 30;
          break;
        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](13);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;
        case 30:
          _context.prev = 30;
          _context.prev = 31;
          if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
            _context.next = 35;
            break;
          }
          _context.next = 35;
          return (0, _awaitAsyncGenerator2.default)(_iterator2.return());
        case 35:
          _context.prev = 35;
          if (!_didIteratorError2) {
            _context.next = 38;
            break;
          }
          throw _iteratorError2;
        case 38:
          return _context.finish(35);
        case 39:
          return _context.finish(30);
        case 40:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[13, 26, 30, 40], [31,, 35, 39]]);
  }));
  return _parseParquetFileInColumnarBatches.apply(this, arguments);
}
function convertRowGroupToTableBatch(parquetSchema, rowGroup, schema) {
  var data = (0, _shred.materializeColumns)(parquetSchema, rowGroup);
  return {
    shape: 'columnar-table',
    batchType: 'data',
    schema: schema,
    data: data,
    length: rowGroup.rowCount
  };
}
//# sourceMappingURL=parse-parquet-to-columns.js.map