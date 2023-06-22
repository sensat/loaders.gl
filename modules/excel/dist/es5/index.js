"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExcelLoader = void 0;
Object.defineProperty(exports, "ExcelWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _excelLoader.ExcelLoader;
  }
});
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _excelLoader = require("./excel-loader");
var _parseExcel = require("./lib/parse-excel");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ExcelLoader = _objectSpread(_objectSpread({}, _excelLoader.ExcelLoader), {}, {
  parse: function parse(arrayBuffer, options) {
    return (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
      var data;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            data = (0, _parseExcel.parseExcel)(arrayBuffer, options);
            return _context.abrupt("return", {
              shape: 'object-row-table',
              data: data
            });
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }
});
exports.ExcelLoader = ExcelLoader;
//# sourceMappingURL=index.js.map