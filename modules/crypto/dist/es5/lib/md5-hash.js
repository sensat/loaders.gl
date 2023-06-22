"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MD5Hash = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _hash2 = require("./hash");
var _md5Wasm = _interopRequireDefault(require("./algorithms/md5-wasm"));
var _digestUtils = require("./utils/digest-utils");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MD5Hash = function (_Hash) {
  (0, _inherits2.default)(MD5Hash, _Hash);
  var _super = _createSuper(MD5Hash);
  function MD5Hash() {
    var _this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, MD5Hash);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", 'md5');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "options", void 0);
    _this.options = options;
    return _this;
  }
  (0, _createClass2.default)(MD5Hash, [{
    key: "hash",
    value: function () {
      var _hash = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(input) {
        var md5Promise, hex;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              md5Promise = new Promise(function (resolve, reject) {
                return (0, _md5Wasm.default)(input).then(resolve).catch(reject);
              });
              _context.next = 3;
              return md5Promise;
            case 3:
              hex = _context.sent;
              return _context.abrupt("return", (0, _digestUtils.hexToBase64)(hex));
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function hash(_x) {
        return _hash.apply(this, arguments);
      }
      return hash;
    }()
  }]);
  return MD5Hash;
}(_hash2.Hash);
exports.MD5Hash = MD5Hash;
//# sourceMappingURL=md5-hash.js.map