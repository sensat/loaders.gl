"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PCDLoader = void 0;
Object.defineProperty(exports, "PCDWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _pcdLoader.PCDLoader;
  }
});
exports._typecheckPCDLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _parsePcd = _interopRequireDefault(require("./lib/parse-pcd"));
var _pcdLoader = require("./pcd-loader");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PCDLoader = _objectSpread(_objectSpread({}, _pcdLoader.PCDLoader), {}, {
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parsePcd.default)(arrayBuffer));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }(),
  parseSync: _parsePcd.default
});
exports.PCDLoader = PCDLoader;
var _typecheckPCDLoader = PCDLoader;
exports._typecheckPCDLoader = _typecheckPCDLoader;
//# sourceMappingURL=index.js.map