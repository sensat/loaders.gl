"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OBJLoader = exports.MTLLoader = void 0;
Object.defineProperty(exports, "OBJWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _objLoader.OBJLoader;
  }
});
exports._typecheckOBJLoader = exports._typecheckMTLLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _parseObj = require("./lib/parse-obj");
var _objLoader = require("./obj-loader");
var _parseMtl = require("./lib/parse-mtl");
var _mtlLoader = require("./mtl-loader");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var OBJLoader = _objectSpread(_objectSpread({}, _objLoader.OBJLoader), {}, {
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parseObj.parseOBJ)(new TextDecoder().decode(arrayBuffer), options));
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
  parseTextSync: function parseTextSync(text, options) {
    return (0, _parseObj.parseOBJ)(text, options);
  }
});
exports.OBJLoader = OBJLoader;
var MTLLoader = _objectSpread(_objectSpread({}, _mtlLoader.MTLLoader), {}, {
  parse: function () {
    var _parse2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", (0, _parseMtl.parseMTL)(new TextDecoder().decode(arrayBuffer), options === null || options === void 0 ? void 0 : options.mtl));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function parse(_x3, _x4) {
      return _parse2.apply(this, arguments);
    }
    return parse;
  }(),
  parseTextSync: function parseTextSync(text, options) {
    return (0, _parseMtl.parseMTL)(text, options === null || options === void 0 ? void 0 : options.mtl);
  }
});
exports.MTLLoader = MTLLoader;
var _typecheckOBJLoader = OBJLoader;
exports._typecheckOBJLoader = _typecheckOBJLoader;
var _typecheckMTLLoader = MTLLoader;
exports._typecheckMTLLoader = _typecheckMTLLoader;
//# sourceMappingURL=index.js.map