"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadWasm = loadWasm;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var wasmEsm = _interopRequireWildcard(require("parquet-wasm/esm2/arrow1"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var cached = null;
function loadWasm(_x) {
  return _loadWasm.apply(this, arguments);
}
function _loadWasm() {
  _loadWasm = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(wasmUrl) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(cached !== null)) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", cached);
        case 2:
          _context.next = 4;
          return wasmEsm.default(wasmUrl);
        case 4:
          cached = wasmEsm;
          return _context.abrupt("return", wasmEsm);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _loadWasm.apply(this, arguments);
}
//# sourceMappingURL=load-wasm-browser.js.map