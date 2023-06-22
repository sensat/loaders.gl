"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReadableStreamPolyfill = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _webStreamsPolyfill = require("web-streams-polyfill");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
delete global.ReadableStream;
var ReadableStreamPolyfill = function (_WSPReadableStream) {
  (0, _inherits2.default)(ReadableStreamPolyfill, _WSPReadableStream);
  var _super = _createSuper(ReadableStreamPolyfill);
  function ReadableStreamPolyfill() {
    (0, _classCallCheck2.default)(this, ReadableStreamPolyfill);
    return _super.apply(this, arguments);
  }
  return (0, _createClass2.default)(ReadableStreamPolyfill);
}(_webStreamsPolyfill.ReadableStream);
exports.ReadableStreamPolyfill = ReadableStreamPolyfill;
//# sourceMappingURL=readable-stream.js.map