"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LZOCompression = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _loaderUtils = require("@loaders.gl/loader-utils");
var _compression = require("./compression");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var lzo;
var LZOCompression = function (_Compression) {
  (0, _inherits2.default)(LZOCompression, _Compression);
  var _super = _createSuper(LZOCompression);
  function LZOCompression(options) {
    var _this$options, _this$options$modules;
    var _this;
    (0, _classCallCheck2.default)(this, LZOCompression);
    _this = _super.call(this, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", 'lzo');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "extensions", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentEncodings", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSupported", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "options", void 0);
    _this.options = options;
    lzo = lzo || ((_this$options = _this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules.lzo);
    if (!lzo) {
      throw new Error(_this.name);
    }
    return _this;
  }
  (0, _createClass2.default)(LZOCompression, [{
    key: "preload",
    value: function () {
      var _preload = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function preload() {
        return _preload.apply(this, arguments);
      }
      return preload;
    }()
  }, {
    key: "compress",
    value: function () {
      var _compress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(input) {
        var inputBuffer;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.preload();
            case 2:
              inputBuffer = (0, _loaderUtils.toBuffer)(input);
              return _context2.abrupt("return", lzo.compress(inputBuffer).buffer);
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function compress(_x) {
        return _compress.apply(this, arguments);
      }
      return compress;
    }()
  }, {
    key: "decompress",
    value: function () {
      var _decompress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(input) {
        var inputBuffer;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return this.preload();
            case 3:
              inputBuffer = (0, _loaderUtils.toBuffer)(input);
              return _context3.abrupt("return", lzo.decompress(inputBuffer).buffer);
            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              throw _context3.t0;
            case 10:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[0, 7]]);
      }));
      function decompress(_x2) {
        return _decompress.apply(this, arguments);
      }
      return decompress;
    }()
  }]);
  return LZOCompression;
}(_compression.Compression);
exports.LZOCompression = LZOCompression;
//# sourceMappingURL=lzo-compression.js.map