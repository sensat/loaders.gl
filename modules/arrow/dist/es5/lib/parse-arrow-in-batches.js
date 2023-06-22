"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseArrowInBatches = parseArrowInBatches;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _apacheArrow = require("apache-arrow");
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
function parseArrowInBatches(asyncIterator) {
  function makeArrowAsyncIterator() {
    return _makeArrowAsyncIterator.apply(this, arguments);
  }
  function _makeArrowAsyncIterator() {
    _makeArrowAsyncIterator = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee() {
      var readers, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, reader, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, batch;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            readers = _apacheArrow.RecordBatchReader.readAll(asyncIterator);
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context.prev = 3;
            _iterator = _asyncIterator(readers);
          case 5:
            _context.next = 7;
            return (0, _awaitAsyncGenerator2.default)(_iterator.next());
          case 7:
            if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
              _context.next = 42;
              break;
            }
            reader = _step.value;
            _iteratorAbruptCompletion2 = false;
            _didIteratorError2 = false;
            _context.prev = 11;
            _iterator2 = _asyncIterator(reader);
          case 13:
            _context.next = 15;
            return (0, _awaitAsyncGenerator2.default)(_iterator2.next());
          case 15:
            if (!(_iteratorAbruptCompletion2 = !(_step2 = _context.sent).done)) {
              _context.next = 22;
              break;
            }
            batch = _step2.value;
            _context.next = 19;
            return processBatch(batch);
          case 19:
            _iteratorAbruptCompletion2 = false;
            _context.next = 13;
            break;
          case 22:
            _context.next = 28;
            break;
          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;
          case 28:
            _context.prev = 28;
            _context.prev = 29;
            if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
              _context.next = 33;
              break;
            }
            _context.next = 33;
            return (0, _awaitAsyncGenerator2.default)(_iterator2.return());
          case 33:
            _context.prev = 33;
            if (!_didIteratorError2) {
              _context.next = 36;
              break;
            }
            throw _iteratorError2;
          case 36:
            return _context.finish(33);
          case 37:
            return _context.finish(28);
          case 38:
            return _context.abrupt("break", 42);
          case 39:
            _iteratorAbruptCompletion = false;
            _context.next = 5;
            break;
          case 42:
            _context.next = 48;
            break;
          case 44:
            _context.prev = 44;
            _context.t1 = _context["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context.t1;
          case 48:
            _context.prev = 48;
            _context.prev = 49;
            if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
              _context.next = 53;
              break;
            }
            _context.next = 53;
            return (0, _awaitAsyncGenerator2.default)(_iterator.return());
          case 53:
            _context.prev = 53;
            if (!_didIteratorError) {
              _context.next = 56;
              break;
            }
            throw _iteratorError;
          case 56:
            return _context.finish(53);
          case 57:
            return _context.finish(48);
          case 58:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 44, 48, 58], [11, 24, 28, 38], [29,, 33, 37], [49,, 53, 57]]);
    }));
    return _makeArrowAsyncIterator.apply(this, arguments);
  }
  return makeArrowAsyncIterator();
}
function processBatch(batch) {
  var values = {
    metadata: batch.schema.metadata,
    length: batch.length
  };
  batch.schema.fields.forEach(function (_ref, index) {
    var name = _ref.name;
    values[name] = batch.getChildAt(index).toArray();
  });
  return values;
}
//# sourceMappingURL=parse-arrow-in-batches.js.map