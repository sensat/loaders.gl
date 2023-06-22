"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LZ4Compression = void 0;
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
var LZ4_MAGIC_NUMBER = 0x184d2204;
var lz4js;
var LZ4Compression = function (_Compression) {
  (0, _inherits2.default)(LZ4Compression, _Compression);
  var _super = _createSuper(LZ4Compression);
  function LZ4Compression(options) {
    var _this$options, _this$options$modules;
    var _this;
    (0, _classCallCheck2.default)(this, LZ4Compression);
    _this = _super.call(this, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", 'lz4');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "extensions", ['lz4']);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentEncodings", ['x-lz4']);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSupported", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "options", void 0);
    _this.options = options;
    lz4js = lz4js || ((_this$options = _this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules.lz4js);
    if (!lz4js) {
      throw new Error(_this.name);
    }
    return _this;
  }
  (0, _createClass2.default)(LZ4Compression, [{
    key: "compressSync",
    value: function compressSync(input) {
      var inputArray = new Uint8Array(input);
      return lz4js.compress(inputArray).buffer;
    }
  }, {
    key: "decompressSync",
    value: function decompressSync(data, maxSize) {
      try {
        var isMagicNumberExists = this.checkMagicNumber(data);
        var inputArray = new Uint8Array(data);
        if (isMagicNumberExists) {
          return lz4js.decompress(inputArray, maxSize).buffer;
        }
        if (!maxSize) {
          var error = new Error('Need to provide maxSize');
          throw this.improveError(error);
        }
        var uncompressed = new Uint8Array(maxSize);
        var uncompressedSize = this.decodeBlock(inputArray, uncompressed);
        uncompressed = uncompressed.slice(0, uncompressedSize);
        return (0, _loaderUtils.toArrayBuffer)(uncompressed);
      } catch (error) {
        throw this.improveError(error);
      }
    }
  }, {
    key: "decodeBlock",
    value: function decodeBlock(data, output, startIndex, endIndex) {
      startIndex = startIndex || 0;
      endIndex = endIndex || data.length - startIndex;
      var uncompressedSize = 0;
      for (var index = startIndex; index < endIndex;) {
        var token = data[index++];
        var literalsLength = token >> 4;
        if (literalsLength > 0) {
          var _length = literalsLength + 240;
          while (_length === 255) {
            _length = data[index++];
            literalsLength += _length;
          }
          var _end = index + literalsLength;
          while (index < _end) {
            output[uncompressedSize++] = data[index++];
          }
          if (index === endIndex) {
            return uncompressedSize;
          }
        }
        var offset = data[index++] | data[index++] << 8;
        if (offset === 0 || offset > uncompressedSize) {
          return -(index - 2);
        }
        var matchLength = token & 0xf;
        var length = matchLength + 240;
        while (length === 255) {
          length = data[index++];
          matchLength += length;
        }
        var pos = uncompressedSize - offset;
        var end = uncompressedSize + matchLength + 4;
        while (uncompressedSize < end) {
          output[uncompressedSize++] = output[pos++];
        }
      }
      return uncompressedSize;
    }
  }, {
    key: "checkMagicNumber",
    value: function checkMagicNumber(data) {
      var magic = new Uint32Array(data.slice(0, 4));
      return magic[0] === LZ4_MAGIC_NUMBER;
    }
  }]);
  return LZ4Compression;
}(_compression.Compression);
exports.LZ4Compression = LZ4Compression;
//# sourceMappingURL=lz4-compression.js.map