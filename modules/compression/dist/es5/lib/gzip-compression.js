"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GZipCompression = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _deflateCompression = require("./deflate-compression");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var GZipCompression = function (_DeflateCompression) {
  (0, _inherits2.default)(GZipCompression, _DeflateCompression);
  var _super = _createSuper(GZipCompression);
  function GZipCompression(options) {
    var _this;
    (0, _classCallCheck2.default)(this, GZipCompression);
    _this = _super.call(this, _objectSpread(_objectSpread({}, options), {}, {
      deflate: _objectSpread(_objectSpread({}, options === null || options === void 0 ? void 0 : options.gzip), {}, {
        gzip: true
      })
    }));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", 'gzip');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "extensions", ['gz', 'gzip']);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentEncodings", ['gzip', 'x-gzip']);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isSupported", true);
    return _this;
  }
  return (0, _createClass2.default)(GZipCompression);
}(_deflateCompression.DeflateCompression);
exports.GZipCompression = GZipCompression;
//# sourceMappingURL=gzip-compression.js.map