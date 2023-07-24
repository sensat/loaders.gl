"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTile3DContent = exports.loadNestedTileset = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@loaders.gl/core");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var loadNestedTileset = function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(sourceTileset, sourceTile, tilesetLoadOptions) {
    var isTileset, loadOptions, tileContent;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          isTileset = sourceTile.type === 'json';
          if (!(!sourceTileset || !sourceTile.contentUrl || !isTileset)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return");
        case 3:
          loadOptions = _objectSpread(_objectSpread({}, tilesetLoadOptions), {}, (0, _defineProperty2.default)({}, sourceTileset.loader.id, {
            isTileset: isTileset,
            assetGltfUpAxis: sourceTileset.asset && sourceTileset.asset.gltfUpAxis || 'Y'
          }));
          _context.next = 6;
          return (0, _core.load)(sourceTile.contentUrl, sourceTileset.loader, loadOptions);
        case 6:
          tileContent = _context.sent;
          if (tileContent.root) {
            sourceTile.children = [tileContent.root];
          }
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function loadNestedTileset(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
exports.loadNestedTileset = loadNestedTileset;
var loadTile3DContent = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(sourceTileset, sourceTile, tilesetLoadOptions) {
    var isTileset, loadOptions, tileContent;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          isTileset = sourceTile.type === 'json';
          if (!(!sourceTileset || !sourceTile.contentUrl || isTileset)) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return", null);
        case 3:
          loadOptions = _objectSpread(_objectSpread({}, tilesetLoadOptions), {}, (0, _defineProperty2.default)({}, sourceTileset.loader.id, _objectSpread(_objectSpread({}, tilesetLoadOptions[sourceTileset.loader.id] || {}), {}, {
            isTileset: isTileset,
            assetGltfUpAxis: sourceTileset.asset && sourceTileset.asset.gltfUpAxis || 'Y'
          })));
          _context2.next = 6;
          return (0, _core.load)(sourceTile.contentUrl, sourceTileset.loader, loadOptions);
        case 6:
          tileContent = _context2.sent;
          return _context2.abrupt("return", tileContent);
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function loadTile3DContent(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
exports.loadTile3DContent = loadTile3DContent;
//# sourceMappingURL=load-3d-tiles.js.map