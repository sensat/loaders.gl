"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergePreprocessData = exports.analyzeTileContent = exports.GLTF_PRIMITIVE_MODES = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _types = require("../types");
var _gltf = require("@loaders.gl/gltf");
var _core = require("@loaders.gl/core");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var GLTF_PRIMITIVE_MODES = [_types.GltfPrimitiveModeString.POINTS, _types.GltfPrimitiveModeString.LINES, _types.GltfPrimitiveModeString.LINE_LOOP, _types.GltfPrimitiveModeString.LINE_STRIP, _types.GltfPrimitiveModeString.TRIANGLES, _types.GltfPrimitiveModeString.TRIANGLE_STRIP, _types.GltfPrimitiveModeString.TRIANGLE_FAN];
exports.GLTF_PRIMITIVE_MODES = GLTF_PRIMITIVE_MODES;
var analyzeTileContent = function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(tileContent) {
    var result, gltfData, gltf, meshTypes;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          result = {
            meshTopologyTypes: new Set()
          };
          if (tileContent !== null && tileContent !== void 0 && tileContent.gltfArrayBuffer) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", result);
        case 3:
          _context.next = 5;
          return (0, _core.parse)(tileContent.gltfArrayBuffer, _gltf.GLTFLoader, {
            gltf: {
              normalize: false,
              loadBuffers: false,
              loadImages: false,
              decompressMeshes: false
            }
          });
        case 5:
          gltfData = _context.sent;
          gltf = gltfData.json;
          if (gltf) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", result);
        case 9:
          meshTypes = getMeshTypesFromGltf(gltf);
          result.meshTopologyTypes = meshTypes;
          return _context.abrupt("return", result);
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function analyzeTileContent(_x) {
    return _ref.apply(this, arguments);
  };
}();
exports.analyzeTileContent = analyzeTileContent;
var getMeshTypesFromGltf = function getMeshTypesFromGltf(gltfJson) {
  var result = new Set();
  var _iterator = _createForOfIteratorHelper(gltfJson.meshes || []),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mesh = _step.value;
      var _iterator2 = _createForOfIteratorHelper(mesh.primitives),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var primitive = _step2.value;
          var mode = primitive.mode;
          if (typeof mode !== 'number') {
            mode = 4;
          }
          result.add(GLTF_PRIMITIVE_MODES[mode]);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
};
var mergePreprocessData = function mergePreprocessData(object1, object2) {
  var _iterator3 = _createForOfIteratorHelper(object2.meshTopologyTypes),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var type = _step3.value;
      object1.meshTopologyTypes.add(type);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
};
exports.mergePreprocessData = mergePreprocessData;
//# sourceMappingURL=preprocess-3d-tiles.js.map