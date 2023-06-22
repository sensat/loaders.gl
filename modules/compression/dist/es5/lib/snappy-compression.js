"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnappyCompression = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _compression = require("./compression");
var _snappyjs = require("snappyjs");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var SnappyCompression = function (_Compression) {
  (0, _inherits2.default)(SnappyCompression, _Compression);
  var _super = _createSuper(SnappyCompression);
  function SnappyCompression(options) {
    var _this;
    (0, _classCallCheck2.default)(this, SnappyCompression);
    _this = _super.call(this, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", 'snappy');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "extensions", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentEncodings", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSupported", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "options", void 0);
    _this.options = options || {};
    return _this;
  }
  (0, _createClass2.default)(SnappyCompression, [{
    key: "compressSync",
    value: function compressSync(input) {
      return (0, _snappyjs.compress)(input);
    }
  }, {
    key: "decompressSync",
    value: function decompressSync(input) {
      return (0, _snappyjs.uncompress)(input);
    }
  }]);
  return SnappyCompression;
}(_compression.Compression);
exports.SnappyCompression = SnappyCompression;
//# sourceMappingURL=snappy-compression.js.map