"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverseDatasetWith = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var traverseDatasetWith = function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(tile, traversalProps, processTile, postprocessTile, maxDepth) {
    var level,
      processResults,
      newTraversalProps,
      _iterator,
      _step,
      childTile,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          level = _args.length > 5 && _args[5] !== undefined ? _args[5] : 0;
          if (!(maxDepth && level > maxDepth)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return");
        case 3:
          processResults = [];
          _context.next = 6;
          return processTile(tile, traversalProps);
        case 6:
          newTraversalProps = _context.sent;
          processResults.push(newTraversalProps);
          _iterator = _createForOfIteratorHelper(tile.children);
          _context.prev = 9;
          _iterator.s();
        case 11:
          if ((_step = _iterator.n()).done) {
            _context.next = 17;
            break;
          }
          childTile = _step.value;
          _context.next = 15;
          return traverseDatasetWith(childTile, newTraversalProps, processTile, postprocessTile, maxDepth, level + 1);
        case 15:
          _context.next = 11;
          break;
        case 17:
          _context.next = 22;
          break;
        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](9);
          _iterator.e(_context.t0);
        case 22:
          _context.prev = 22;
          _iterator.f();
          return _context.finish(22);
        case 25:
          _context.t1 = postprocessTile;
          if (!_context.t1) {
            _context.next = 29;
            break;
          }
          _context.next = 29;
          return postprocessTile(processResults, traversalProps);
        case 29:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[9, 19, 22, 25]]);
  }));
  return function traverseDatasetWith(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();
exports.traverseDatasetWith = traverseDatasetWith;
//# sourceMappingURL=tileset-traversal.js.map