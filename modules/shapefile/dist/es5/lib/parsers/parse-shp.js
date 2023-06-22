"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSHP = parseSHP;
exports.parseSHPInBatches = parseSHPInBatches;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _binaryChunkReader = _interopRequireDefault(require("../streaming/binary-chunk-reader"));
var _parseShpHeader = require("./parse-shp-header");
var _parseShpGeometry = require("./parse-shp-geometry");
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var LITTLE_ENDIAN = true;
var BIG_ENDIAN = false;
var SHP_HEADER_SIZE = 100;
var SHP_RECORD_HEADER_SIZE = 12;
var STATE = {
  EXPECTING_HEADER: 0,
  EXPECTING_RECORD: 1,
  END: 2,
  ERROR: 3
};
var SHPParser = function () {
  function SHPParser(options) {
    (0, _classCallCheck2.default)(this, SHPParser);
    (0, _defineProperty2.default)(this, "options", {});
    (0, _defineProperty2.default)(this, "binaryReader", new _binaryChunkReader.default({
      maxRewindBytes: SHP_RECORD_HEADER_SIZE
    }));
    (0, _defineProperty2.default)(this, "state", STATE.EXPECTING_HEADER);
    (0, _defineProperty2.default)(this, "result", {
      geometries: [],
      progress: {
        bytesTotal: NaN,
        bytesUsed: NaN,
        rows: NaN
      },
      currentIndex: NaN
    });
    this.options = options;
  }
  (0, _createClass2.default)(SHPParser, [{
    key: "write",
    value: function write(arrayBuffer) {
      this.binaryReader.write(arrayBuffer);
      this.state = parseState(this.state, this.result, this.binaryReader, this.options);
    }
  }, {
    key: "end",
    value: function end() {
      this.binaryReader.end();
      this.state = parseState(this.state, this.result, this.binaryReader, this.options);
      if (this.state !== STATE.END) {
        this.state = STATE.ERROR;
        this.result.error = 'SHP incomplete file';
      }
    }
  }]);
  return SHPParser;
}();
function parseSHP(arrayBuffer, options) {
  var shpParser = new SHPParser(options);
  shpParser.write(arrayBuffer);
  shpParser.end();
  return shpParser.result;
}
function parseSHPInBatches(_x, _x2) {
  return _parseSHPInBatches.apply(this, arguments);
}
function _parseSHPInBatches() {
  _parseSHPInBatches = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(asyncIterator, options) {
    var parser, headerReturned, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, arrayBuffer;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          parser = new SHPParser(options);
          headerReturned = false;
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context.prev = 4;
          _iterator = _asyncIterator(asyncIterator);
        case 6:
          _context.next = 8;
          return (0, _awaitAsyncGenerator2.default)(_iterator.next());
        case 8:
          if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
            _context.next = 22;
            break;
          }
          arrayBuffer = _step.value;
          parser.write(arrayBuffer);
          if (!(!headerReturned && parser.result.header)) {
            _context.next = 15;
            break;
          }
          headerReturned = true;
          _context.next = 15;
          return parser.result.header;
        case 15:
          if (!(parser.result.geometries.length > 0)) {
            _context.next = 19;
            break;
          }
          _context.next = 18;
          return parser.result.geometries;
        case 18:
          parser.result.geometries = [];
        case 19:
          _iteratorAbruptCompletion = false;
          _context.next = 6;
          break;
        case 22:
          _context.next = 28;
          break;
        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](4);
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
          parser.end();
          if (!(parser.result.geometries.length > 0)) {
            _context.next = 42;
            break;
          }
          _context.next = 42;
          return parser.result.geometries;
        case 42:
          return _context.abrupt("return");
        case 43:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 24, 28, 38], [29,, 33, 37]]);
  }));
  return _parseSHPInBatches.apply(this, arguments);
}
function parseState(state, result, binaryReader, options) {
  while (true) {
    try {
      switch (state) {
        case STATE.ERROR:
        case STATE.END:
          return state;
        case STATE.EXPECTING_HEADER:
          var dataView = binaryReader.getDataView(SHP_HEADER_SIZE);
          if (!dataView) {
            return state;
          }
          result.header = (0, _parseShpHeader.parseSHPHeader)(dataView);
          result.progress = {
            bytesUsed: 0,
            bytesTotal: result.header.length,
            rows: 0
          };
          result.currentIndex = 1;
          state = STATE.EXPECTING_RECORD;
          break;
        case STATE.EXPECTING_RECORD:
          while (binaryReader.hasAvailableBytes(SHP_RECORD_HEADER_SIZE)) {
            var _result$header;
            var recordHeaderView = binaryReader.getDataView(SHP_RECORD_HEADER_SIZE);
            var recordHeader = {
              recordNumber: recordHeaderView.getInt32(0, BIG_ENDIAN),
              byteLength: recordHeaderView.getInt32(4, BIG_ENDIAN) * 2,
              type: recordHeaderView.getInt32(8, LITTLE_ENDIAN)
            };
            if (!binaryReader.hasAvailableBytes(recordHeader.byteLength - 4)) {
              binaryReader.rewind(SHP_RECORD_HEADER_SIZE);
              return state;
            }
            var invalidRecord = recordHeader.byteLength < 4 || recordHeader.type !== ((_result$header = result.header) === null || _result$header === void 0 ? void 0 : _result$header.type) || recordHeader.recordNumber !== result.currentIndex;
            if (invalidRecord) {
              binaryReader.rewind(SHP_RECORD_HEADER_SIZE - 4);
            } else {
              binaryReader.rewind(4);
              var recordView = binaryReader.getDataView(recordHeader.byteLength);
              var geometry = (0, _parseShpGeometry.parseRecord)(recordView, options);
              result.geometries.push(geometry);
              result.currentIndex++;
              result.progress.rows = result.currentIndex - 1;
            }
          }
          if (binaryReader.ended) {
            state = STATE.END;
          }
          return state;
        default:
          state = STATE.ERROR;
          result.error = "illegal parser state ".concat(state);
          return state;
      }
    } catch (error) {
      state = STATE.ERROR;
      result.error = "SHP parsing failed: ".concat(error === null || error === void 0 ? void 0 : error.message);
      return state;
    }
  }
}
//# sourceMappingURL=parse-shp.js.map