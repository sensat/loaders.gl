"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseParquet = parseParquet;
exports.parseParquetFileInBatches = parseParquetFileInBatches;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _loaderUtils = require("@loaders.gl/loader-utils");
var _parquetReader = require("../../parquetjs/parser/parquet-reader");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
function parseParquet(_x3, _x4) {
  return _parseParquet.apply(this, arguments);
}
function _parseParquet() {
  _parseParquet = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, options) {
    var blob, rows, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, batch, _iterator3, _step3, row;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          blob = new Blob([arrayBuffer]);
          rows = [];
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context2.prev = 4;
          _iterator = _asyncIterator(parseParquetFileInBatches(blob, options));
        case 6:
          _context2.next = 8;
          return _iterator.next();
        case 8:
          if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
            _context2.next = 15;
            break;
          }
          batch = _step.value;
          _iterator3 = _createForOfIteratorHelper(batch.data);
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              row = _step3.value;
              rows.push(row);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        case 12:
          _iteratorAbruptCompletion = false;
          _context2.next = 6;
          break;
        case 15:
          _context2.next = 21;
          break;
        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](4);
          _didIteratorError = true;
          _iteratorError = _context2.t0;
        case 21:
          _context2.prev = 21;
          _context2.prev = 22;
          if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
            _context2.next = 26;
            break;
          }
          _context2.next = 26;
          return _iterator.return();
        case 26:
          _context2.prev = 26;
          if (!_didIteratorError) {
            _context2.next = 29;
            break;
          }
          throw _iteratorError;
        case 29:
          return _context2.finish(26);
        case 30:
          return _context2.finish(21);
        case 31:
          return _context2.abrupt("return", {
            shape: 'object-row-table',
            data: rows
          });
        case 32:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[4, 17, 21, 31], [22,, 26, 30]]);
  }));
  return _parseParquet.apply(this, arguments);
}
function parseParquetFileInBatches(_x, _x2) {
  return _parseParquetFileInBatches.apply(this, arguments);
}
function _parseParquetFileInBatches() {
  _parseParquetFileInBatches = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(blob, options) {
    var file, reader, rowBatches, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, rows;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          file = (0, _loaderUtils.makeReadableFile)(blob);
          reader = new _parquetReader.ParquetReader(file);
          rowBatches = reader.rowBatchIterator(options === null || options === void 0 ? void 0 : options.parquet);
          _iteratorAbruptCompletion2 = false;
          _didIteratorError2 = false;
          _context.prev = 5;
          _iterator2 = _asyncIterator(rowBatches);
        case 7:
          _context.next = 9;
          return (0, _awaitAsyncGenerator2.default)(_iterator2.next());
        case 9:
          if (!(_iteratorAbruptCompletion2 = !(_step2 = _context.sent).done)) {
            _context.next = 16;
            break;
          }
          rows = _step2.value;
          _context.next = 13;
          return {
            shape: 'object-row-table',
            data: rows,
            batchType: 'data',
            length: rows.length
          };
        case 13:
          _iteratorAbruptCompletion2 = false;
          _context.next = 7;
          break;
        case 16:
          _context.next = 22;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;
        case 22:
          _context.prev = 22;
          _context.prev = 23;
          if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
            _context.next = 27;
            break;
          }
          _context.next = 27;
          return (0, _awaitAsyncGenerator2.default)(_iterator2.return());
        case 27:
          _context.prev = 27;
          if (!_didIteratorError2) {
            _context.next = 30;
            break;
          }
          throw _iteratorError2;
        case 30:
          return _context.finish(27);
        case 31:
          return _context.finish(22);
        case 32:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 18, 22, 32], [23,, 27, 31]]);
  }));
  return _parseParquetFileInBatches.apply(this, arguments);
}
//# sourceMappingURL=parse-parquet-to-rows.js.map