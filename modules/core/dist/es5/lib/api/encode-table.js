"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeTable = encodeTable;
exports.encodeTableAsText = encodeTableAsText;
exports.encodeTableInBatches = encodeTableInBatches;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _loaderUtils = require("@loaders.gl/loader-utils");
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
function encodeTable(_x, _x2, _x3) {
  return _encodeTable.apply(this, arguments);
}
function _encodeTable() {
  _encodeTable = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data, writer, options) {
    var text, batches, chunks, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, batch;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!writer.encode) {
            _context.next = 4;
            break;
          }
          _context.next = 3;
          return writer.encode(data, options);
        case 3:
          return _context.abrupt("return", _context.sent);
        case 4:
          if (!writer.encodeText) {
            _context.next = 9;
            break;
          }
          _context.next = 7;
          return writer.encodeText(data, options);
        case 7:
          text = _context.sent;
          return _context.abrupt("return", new TextEncoder().encode(text));
        case 9:
          if (!writer.encodeInBatches) {
            _context.next = 41;
            break;
          }
          batches = encodeTableInBatches(data, writer, options);
          chunks = [];
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context.prev = 14;
          _iterator = _asyncIterator(batches);
        case 16:
          _context.next = 18;
          return _iterator.next();
        case 18:
          if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
            _context.next = 24;
            break;
          }
          batch = _step.value;
          chunks.push(batch);
        case 21:
          _iteratorAbruptCompletion = false;
          _context.next = 16;
          break;
        case 24:
          _context.next = 30;
          break;
        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context.t0;
        case 30:
          _context.prev = 30;
          _context.prev = 31;
          if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
            _context.next = 35;
            break;
          }
          _context.next = 35;
          return _iterator.return();
        case 35:
          _context.prev = 35;
          if (!_didIteratorError) {
            _context.next = 38;
            break;
          }
          throw _iteratorError;
        case 38:
          return _context.finish(35);
        case 39:
          return _context.finish(30);
        case 40:
          return _context.abrupt("return", _loaderUtils.concatenateArrayBuffers.apply(void 0, chunks));
        case 41:
          throw new Error('Writer could not encode data');
        case 42:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[14, 26, 30, 40], [31,, 35, 39]]);
  }));
  return _encodeTable.apply(this, arguments);
}
function encodeTableAsText(_x4, _x5, _x6) {
  return _encodeTableAsText.apply(this, arguments);
}
function _encodeTableAsText() {
  _encodeTableAsText = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(data, writer, options) {
    var arrayBuffer;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(writer.text && writer.encodeText)) {
            _context2.next = 4;
            break;
          }
          _context2.next = 3;
          return writer.encodeText(data, options);
        case 3:
          return _context2.abrupt("return", _context2.sent);
        case 4:
          if (!(writer.text && (writer.encode || writer.encodeInBatches))) {
            _context2.next = 9;
            break;
          }
          _context2.next = 7;
          return encodeTable(data, writer, options);
        case 7:
          arrayBuffer = _context2.sent;
          return _context2.abrupt("return", new TextDecoder().decode(arrayBuffer));
        case 9:
          throw new Error('Writer could not encode data as text');
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _encodeTableAsText.apply(this, arguments);
}
function encodeTableInBatches(data, writer, options) {
  if (writer.encodeInBatches) {
    var dataIterator = getIterator(data);
    return writer.encodeInBatches(dataIterator, options);
  }
  throw new Error('Writer could not encode data in batches');
}
function getIterator(data) {
  var dataIterator = [{
    table: data,
    start: 0,
    end: data.length
  }];
  return dataIterator;
}
//# sourceMappingURL=encode-table.js.map