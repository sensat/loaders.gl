"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _tar = _interopRequireDefault(require("./lib/tar/tar"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var TAR_BUILDER_OPTIONS = {
  recordsPerBlock: 20
};
var TARBuilder = function () {
  function TARBuilder(options) {
    (0, _classCallCheck2.default)(this, TARBuilder);
    (0, _defineProperty2.default)(this, "options", void 0);
    (0, _defineProperty2.default)(this, "tape", void 0);
    (0, _defineProperty2.default)(this, "count", 0);
    this.options = _objectSpread(_objectSpread({}, TAR_BUILDER_OPTIONS), options);
    this.tape = new _tar.default(this.options.recordsPerBlock);
  }
  (0, _createClass2.default)(TARBuilder, [{
    key: "addFile",
    value: function addFile(filename, buffer) {
      this.tape.append(filename, new Uint8Array(buffer));
      this.count++;
    }
  }, {
    key: "build",
    value: function () {
      var _build = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Response(this.tape.save()).arrayBuffer());
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function build() {
        return _build.apply(this, arguments);
      }
      return build;
    }()
  }], [{
    key: "properties",
    get: function get() {
      return {
        id: 'tar',
        name: 'TAR',
        extensions: ['tar'],
        mimeTypes: ['application/x-tar'],
        builder: TARBuilder,
        options: TAR_BUILDER_OPTIONS
      };
    }
  }]);
  return TARBuilder;
}();
exports.default = TARBuilder;
//# sourceMappingURL=tar-builder.js.map