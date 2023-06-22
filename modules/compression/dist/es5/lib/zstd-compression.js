"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZstdCompression = void 0;
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
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ZstdCodec;
var zstd;
var ZstdCompression = function (_Compression) {
  (0, _inherits2.default)(ZstdCompression, _Compression);
  var _super = _createSuper(ZstdCompression);
  function ZstdCompression(options) {
    var _this$options, _this$options$modules;
    var _this;
    (0, _classCallCheck2.default)(this, ZstdCompression);
    _this = _super.call(this, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", 'zstd');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "extensions", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentEncodings", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSupported", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "options", void 0);
    _this.options = options;
    ZstdCodec = (_this$options = _this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules['zstd-codec'];
    if (!ZstdCodec) {
      console.warn("".concat(_this.name, " library not installed"));
    }
    return _this;
  }
  (0, _createClass2.default)(ZstdCompression, [{
    key: "preload",
    value: function () {
      var _preload = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!zstd && ZstdCodec)) {
                _context.next = 4;
                break;
              }
              _context.next = 3;
              return new Promise(function (resolve) {
                return ZstdCodec.run(function (zstd) {
                  return resolve(zstd);
                });
              });
            case 3:
              zstd = _context.sent;
            case 4:
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
    key: "compressSync",
    value: function compressSync(input) {
      var simpleZstd = new zstd.Simple();
      var inputArray = new Uint8Array(input);
      return simpleZstd.compress(inputArray).buffer;
    }
  }, {
    key: "decompressSync",
    value: function decompressSync(input) {
      var simpleZstd = new zstd.Simple();
      var inputArray = new Uint8Array(input);
      return simpleZstd.decompress(inputArray).buffer;
    }
  }]);
  return ZstdCompression;
}(_compression.Compression);
exports.ZstdCompression = ZstdCompression;
//# sourceMappingURL=zstd-compression.js.map