"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckNetCDFWorkerLoader = exports._typecheckNetCDFLoader = exports.NetCDFWorkerLoader = exports.NetCDFLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _netcdfReader = require("./netcdfjs/netcdf-reader");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var NetCDFWorkerLoader = {
  name: 'NetCDF',
  id: 'mvt',
  module: 'mvt',
  version: VERSION,
  extensions: ['cdf', 'nc'],
  mimeTypes: ['application/netcdf', 'application/x-netcdf'],
  category: 'image',
  options: {
    netcdf: {
      loadVariables: false
    }
  }
};
exports.NetCDFWorkerLoader = NetCDFWorkerLoader;
var NetCDFLoader = _objectSpread(_objectSpread({}, NetCDFWorkerLoader), {}, {
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", parseNetCDF(arrayBuffer, options));
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
  binary: true
});
exports.NetCDFLoader = NetCDFLoader;
function parseNetCDF(arrayBuffer, options) {
  var _options$netcdf;
  var reader = new _netcdfReader.NetCDFReader(arrayBuffer);
  var variables = {};
  if (options !== null && options !== void 0 && (_options$netcdf = options.netcdf) !== null && _options$netcdf !== void 0 && _options$netcdf.loadData) {
    var _iterator = _createForOfIteratorHelper(reader.variables),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var variable = _step.value;
        variables[variable.name] = reader.getDataVariable(variable);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return {
    loaderData: reader.header,
    data: variables
  };
}
var _typecheckNetCDFWorkerLoader = NetCDFWorkerLoader;
exports._typecheckNetCDFWorkerLoader = _typecheckNetCDFWorkerLoader;
var _typecheckNetCDFLoader = NetCDFLoader;
exports._typecheckNetCDFLoader = _typecheckNetCDFLoader;
//# sourceMappingURL=netcdf-loader.js.map