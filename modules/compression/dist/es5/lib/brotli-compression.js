"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrotliCompression = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _compression = require("./compression");
var _loaderUtils = require("@loaders.gl/loader-utils");
var _decode = require("../brotli/decode");
var _zlib = _interopRequireDefault(require("zlib"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DEFAULT_BROTLI_OPTIONS = {
  brotli: {
    mode: 0,
    quality: 8,
    lgwin: 22
  }
};
var brotli;
var BrotliCompression = function (_Compression) {
  (0, _inherits2.default)(BrotliCompression, _Compression);
  var _super = _createSuper(BrotliCompression);
  function BrotliCompression(options) {
    var _this;
    (0, _classCallCheck2.default)(this, BrotliCompression);
    _this = _super.call(this, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", 'brotli');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "extensions", ['br']);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentEncodings", ['br']);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSupported", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "options", void 0);
    _this.options = options;
    return _this;
  }
  (0, _createClass2.default)(BrotliCompression, [{
    key: "preload",
    value: function () {
      var _preload = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        var _this$options, _this$options$modules;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              brotli = brotli || ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules.brotli);
              if (!brotli) {
                console.warn("".concat(this.name, " library not installed"));
              }
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
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
        var _this$options$brotli;
        var buffer;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!_loaderUtils.isBrowser && (_this$options$brotli = this.options.brotli) !== null && _this$options$brotli !== void 0 && _this$options$brotli.useZlib)) {
                _context2.next = 5;
                break;
              }
              _context2.next = 3;
              return (0, _loaderUtils.promisify1)(_zlib.default.brotliCompress)(input);
            case 3:
              buffer = _context2.sent;
              return _context2.abrupt("return", (0, _loaderUtils.toArrayBuffer)(buffer));
            case 5:
              return _context2.abrupt("return", this.compressSync(input));
            case 6:
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
    key: "compressSync",
    value: function compressSync(input) {
      var _this$options$brotli2, _this$options2;
      if (!_loaderUtils.isBrowser && (_this$options$brotli2 = this.options.brotli) !== null && _this$options$brotli2 !== void 0 && _this$options$brotli2.useZlib) {
        var buffer = _zlib.default.brotliCompressSync(input);
        return (0, _loaderUtils.toArrayBuffer)(buffer);
      }
      var brotliOptions = _objectSpread(_objectSpread({}, DEFAULT_BROTLI_OPTIONS.brotli), (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.brotli);
      var inputArray = new Uint8Array(input);
      if (!brotli) {
        throw new Error('brotli compression: brotli module not installed');
      }
      var outputArray = brotli.compress(inputArray, brotliOptions);
      return outputArray.buffer;
    }
  }, {
    key: "decompress",
    value: function () {
      var _decompress = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(input) {
        var _this$options$brotli3;
        var buffer;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!(!_loaderUtils.isBrowser && (_this$options$brotli3 = this.options.brotli) !== null && _this$options$brotli3 !== void 0 && _this$options$brotli3.useZlib)) {
                _context3.next = 5;
                break;
              }
              _context3.next = 3;
              return (0, _loaderUtils.promisify1)(_zlib.default.brotliDecompress)(input);
            case 3:
              buffer = _context3.sent;
              return _context3.abrupt("return", (0, _loaderUtils.toArrayBuffer)(buffer));
            case 5:
              return _context3.abrupt("return", this.decompressSync(input));
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function decompress(_x2) {
        return _decompress.apply(this, arguments);
      }
      return decompress;
    }()
  }, {
    key: "decompressSync",
    value: function decompressSync(input) {
      var _this$options$brotli4, _this$options3;
      if (!_loaderUtils.isBrowser && (_this$options$brotli4 = this.options.brotli) !== null && _this$options$brotli4 !== void 0 && _this$options$brotli4.useZlib) {
        var buffer = _zlib.default.brotliDecompressSync(input);
        return (0, _loaderUtils.toArrayBuffer)(buffer);
      }
      var brotliOptions = _objectSpread(_objectSpread({}, DEFAULT_BROTLI_OPTIONS.brotli), (_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.brotli);
      var inputArray = new Uint8Array(input);
      if (brotli) {
        var _outputArray = brotli.decompress(inputArray, brotliOptions);
        return _outputArray.buffer;
      }
      var outputArray = (0, _decode.BrotliDecode)(inputArray, undefined);
      return outputArray.buffer;
    }
  }]);
  return BrotliCompression;
}(_compression.Compression);
exports.BrotliCompression = BrotliCompression;
//# sourceMappingURL=brotli-compression.js.map