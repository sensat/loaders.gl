"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseParquetWasm = parseParquetWasm;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _apacheArrow = require("apache-arrow");
var _loadWasmNode = require("./load-wasm/load-wasm-node");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function parseParquetWasm(_x, _x2) {
  return _parseParquetWasm.apply(this, arguments);
}
function _parseParquetWasm() {
  _parseParquetWasm = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
    var _options$parquet;
    var wasmUrl, wasm, arr, arrowIPCUint8Arr, arrowIPCBuffer, arrowTable;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          wasmUrl = options === null || options === void 0 ? void 0 : (_options$parquet = options.parquet) === null || _options$parquet === void 0 ? void 0 : _options$parquet.wasmUrl;
          _context.next = 3;
          return (0, _loadWasmNode.loadWasm)(wasmUrl);
        case 3:
          wasm = _context.sent;
          arr = new Uint8Array(arrayBuffer);
          arrowIPCUint8Arr = wasm.readParquet(arr);
          arrowIPCBuffer = arrowIPCUint8Arr.buffer.slice(arrowIPCUint8Arr.byteOffset, arrowIPCUint8Arr.byteLength + arrowIPCUint8Arr.byteOffset);
          arrowTable = tableFromIPC(arrowIPCBuffer);
          return _context.abrupt("return", arrowTable);
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseParquetWasm.apply(this, arguments);
}
function tableFromIPC(input) {
  var reader = _apacheArrow.RecordBatchStreamReader.from(input);
  var recordBatches = [];
  var _iterator = _createForOfIteratorHelper(reader),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var recordBatch = _step.value;
      recordBatches.push(recordBatch);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return new _apacheArrow.Table(recordBatches);
}
//# sourceMappingURL=parse-parquet-wasm.js.map