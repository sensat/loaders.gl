"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseI3STileAttribute = parseI3STileAttribute;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("./constants");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function parseI3STileAttribute(arrayBuffer, options) {
  var attributeName = options.attributeName,
    attributeType = options.attributeType;
  if (!attributeName) {
    return {};
  }
  return (0, _defineProperty2.default)({}, attributeName, attributeType ? parseAttribute(attributeType, arrayBuffer) : null);
}
function parseAttribute(attributeType, arrayBuffer) {
  switch (attributeType) {
    case _constants.STRING_ATTRIBUTE_TYPE:
      return parseStringsAttribute(arrayBuffer);
    case _constants.OBJECT_ID_ATTRIBUTE_TYPE:
      return parseShortNumberAttribute(arrayBuffer);
    case _constants.FLOAT_64_TYPE:
      return parseFloatAttribute(arrayBuffer);
    case _constants.INT_16_ATTRIBUTE_TYPE:
      return parseInt16ShortNumberAttribute(arrayBuffer);
    default:
      return parseShortNumberAttribute(arrayBuffer);
  }
}
function parseShortNumberAttribute(arrayBuffer) {
  var countOffset = 4;
  return new Uint32Array(arrayBuffer, countOffset);
}
function parseInt16ShortNumberAttribute(arrayBuffer) {
  var countOffset = 4;
  return new Int16Array(arrayBuffer, countOffset);
}
function parseFloatAttribute(arrayBuffer) {
  var countOffset = 8;
  return new Float64Array(arrayBuffer, countOffset);
}
function parseStringsAttribute(arrayBuffer) {
  var stringsCountOffset = 0;
  var dataOffset = 8;
  var bytesPerStringSize = 4;
  var stringsArray = [];
  try {
    var stringsCount = new DataView(arrayBuffer, stringsCountOffset, bytesPerStringSize).getUint32(stringsCountOffset, true);
    var stringSizes = new Uint32Array(arrayBuffer, dataOffset, stringsCount);
    var stringOffset = dataOffset + stringsCount * bytesPerStringSize;
    var _iterator = _createForOfIteratorHelper(stringSizes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var stringByteSize = _step.value;
        var textDecoder = new TextDecoder('utf-8');
        var stringAttribute = new Uint8Array(arrayBuffer, stringOffset, stringByteSize);
        stringsArray.push(textDecoder.decode(stringAttribute));
        stringOffset += stringByteSize;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } catch (error) {
    console.error('Parse string attribute error: ', error.message);
  }
  return stringsArray;
}
//# sourceMappingURL=parse-i3s-attribute.js.map