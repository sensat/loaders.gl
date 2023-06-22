"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilePolyfill = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _blob = require("./blob");
var _Symbol$toStringTag;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
_Symbol$toStringTag = Symbol.toStringTag;
var FilePolyfill = function (_BlobPolyfill) {
  (0, _inherits2.default)(FilePolyfill, _BlobPolyfill);
  var _super = _createSuper(FilePolyfill);
  function FilePolyfill(init, name) {
    var _this;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2.default)(this, FilePolyfill);
    _this = _super.call(this, init, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", '');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "webkitRelativePath", '');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "lastModified", void 0);
    _this.name = String(name).replace(/\//g, ':');
    _this.lastModified = (options === null || options === void 0 ? void 0 : options.lastModified) || Date.now();
    return _this;
  }
  (0, _createClass2.default)(FilePolyfill, [{
    key: _Symbol$toStringTag,
    get: function get() {
      return 'File';
    }
  }]);
  return FilePolyfill;
}(_blob.BlobPolyfill);
exports.FilePolyfill = FilePolyfill;
//# sourceMappingURL=file.js.map