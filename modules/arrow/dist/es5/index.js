"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowLoader = void 0;
Object.defineProperty(exports, "ArrowWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _arrowLoader.ArrowLoader;
  }
});
Object.defineProperty(exports, "ArrowWriter", {
  enumerable: true,
  get: function get() {
    return _arrowWriter.ArrowWriter;
  }
});
Object.defineProperty(exports, "VECTOR_TYPES", {
  enumerable: true,
  get: function get() {
    return _types.VECTOR_TYPES;
  }
});
exports._typecheckArrowLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _arrowLoader = require("./arrow-loader");
var _parseArrowSync = _interopRequireDefault(require("./lib/parse-arrow-sync"));
var _parseArrowInBatches = require("./lib/parse-arrow-in-batches");
var _schema = require("@loaders.gl/schema");
var _arrowTableBatch = _interopRequireDefault(require("./lib/arrow-table-batch"));
var _types = require("./types");
var _arrowWriter = require("./arrow-writer");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
_schema.TableBatchBuilder.ArrowBatch = _arrowTableBatch.default;
var ArrowLoader = _objectSpread(_objectSpread({}, _arrowLoader.ArrowLoader), {}, {
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arraybuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parseArrowSync.default)(arraybuffer, options));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x, _x2) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }(),
  parseSync: _parseArrowSync.default,
  parseInBatches: _parseArrowInBatches.parseArrowInBatches
});
exports.ArrowLoader = ArrowLoader;
var _typecheckArrowLoader = ArrowLoader;
exports._typecheckArrowLoader = _typecheckArrowLoader;
//# sourceMappingURL=index.js.map