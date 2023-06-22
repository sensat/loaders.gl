"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parsePotreeHierarchyChunk;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function parsePotreeHierarchyChunk(arrayBuffer) {
  var tileHeaders = parseBinaryChunk(arrayBuffer);
  return buildHierarchy(tileHeaders);
}
function parseBinaryChunk(arrayBuffer) {
  var byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var dataView = new DataView(arrayBuffer);
  var stack = [];
  var topTileHeader = {};
  byteOffset = decodeRow(dataView, byteOffset, topTileHeader);
  stack.push(topTileHeader);
  var tileHeaders = [];
  while (stack.length > 0) {
    var snode = stack.shift();
    var mask = 1;
    for (var i = 0; i < 8; i++) {
      if (snode && (snode.header.childMask & mask) !== 0) {
        var tileHeader = {};
        byteOffset = decodeRow(dataView, byteOffset, tileHeader);
        tileHeader.name = snode.name + i;
        stack.push(tileHeader);
        tileHeaders.push(tileHeader);
        snode.header.childCount++;
      }
      mask = mask * 2;
    }
    if (byteOffset === dataView.byteLength) {
      break;
    }
  }
  return tileHeaders;
}
function decodeRow(dataView, byteOffset, tileHeader) {
  tileHeader.header = tileHeader.header || {};
  tileHeader.header.childMask = dataView.getUint8(byteOffset);
  tileHeader.header.childCount = 0;
  tileHeader.pointCount = dataView.getUint32(byteOffset + 1, true);
  tileHeader.name = '';
  byteOffset += 5;
  return byteOffset;
}
function buildHierarchy(tileHeaders) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var DEFAULT_OPTIONS = {
    spacing: 100
  };
  options = _objectSpread(_objectSpread({}, DEFAULT_OPTIONS), options);
  var topNode = tileHeaders[0];
  var nodes = {};
  var _iterator = _createForOfIteratorHelper(tileHeaders),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var tileHeader = _step.value;
      var name = tileHeader.name;
      var index = parseInt(name.charAt(name.length - 1), 10);
      var parentName = name.substring(0, name.length - 1);
      var parentNode = nodes[parentName];
      var level = name.length - 1;
      tileHeader.level = level;
      tileHeader.hasChildren = tileHeader.header.childCount;
      tileHeader.children = [];
      tileHeader.childrenByIndex = new Array(8).fill(null);
      tileHeader.spacing = options.spacing / Math.pow(2, level);
      if (parentNode) {
        parentNode.children.push(tileHeader);
        parentNode.childrenByIndex[index] = tileHeader;
      }
      nodes[name] = tileHeader;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return topNode;
}
//# sourceMappingURL=parse-potree-hierarchy-chunk.js.map