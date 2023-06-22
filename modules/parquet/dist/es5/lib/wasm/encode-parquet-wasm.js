"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
exports.tableToIPC = tableToIPC;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _apacheArrow = require("apache-arrow");
var _loadWasm = require("./load-wasm");
function encode(_x, _x2) {
  return _encode.apply(this, arguments);
}
function _encode() {
  _encode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(table, options) {
    var _options$parquet;
    var wasmUrl, wasm, arrowIPCBytes, writerProperties, parquetBytes;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          wasmUrl = options === null || options === void 0 ? void 0 : (_options$parquet = options.parquet) === null || _options$parquet === void 0 ? void 0 : _options$parquet.wasmUrl;
          _context.next = 3;
          return (0, _loadWasm.loadWasm)(wasmUrl);
        case 3:
          wasm = _context.sent;
          arrowIPCBytes = tableToIPC(table);
          writerProperties = new wasm.WriterPropertiesBuilder().build();
          parquetBytes = wasm.writeParquet(arrowIPCBytes, writerProperties);
          return _context.abrupt("return", parquetBytes.buffer.slice(parquetBytes.byteOffset, parquetBytes.byteLength + parquetBytes.byteOffset));
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _encode.apply(this, arguments);
}
function tableToIPC(table) {
  return _apacheArrow.RecordBatchStreamWriter.writeAll(table).toUint8Array(true);
}
//# sourceMappingURL=encode-parquet-wasm.js.map