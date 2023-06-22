"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMTL = parseMTL;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var DELIMITER_PATTERN = /\s+/;
function parseMTL(text, options) {
  var materials = [];
  var currentMaterial = {
    name: 'placeholder'
  };
  var lines = text.split('\n');
  var _iterator = _createForOfIteratorHelper(lines),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      line = line.trim();
      if (line.length === 0 || line.charAt(0) === '#') {
        continue;
      }
      var pos = line.indexOf(' ');
      var key = pos >= 0 ? line.substring(0, pos) : line;
      key = key.toLowerCase();
      var value = pos >= 0 ? line.substring(pos + 1) : '';
      value = value.trim();
      switch (key) {
        case 'newmtl':
          currentMaterial = {
            name: value
          };
          materials.push(currentMaterial);
          break;
        case 'ka':
          currentMaterial.ambientColor = parseColor(value);
          break;
        case 'kd':
          currentMaterial.diffuseColor = parseColor(value);
          break;
        case 'map_kd':
          currentMaterial.diffuseTextureUrl = value;
          break;
        case 'ks':
          currentMaterial.specularColor = parseColor(value);
          break;
        case 'map_ks':
          currentMaterial.specularTextureUrl = value;
          break;
        case 'ke':
          currentMaterial.emissiveColor = parseColor(value);
          break;
        case 'map_ke':
          currentMaterial.emissiveTextureUrl = value;
          break;
        case 'ns':
          currentMaterial.shininess = parseFloat(value);
          break;
        case 'map_ns':
          break;
        case 'ni':
          currentMaterial.refraction = parseFloat(value);
          break;
        case 'illum':
          currentMaterial.illumination = parseFloat(value);
          break;
        default:
          break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return materials;
}
function parseColor(value, options) {
  var rgb = value.split(DELIMITER_PATTERN, 3);
  var color = [parseFloat(rgb[0]), parseFloat(rgb[1]), parseFloat(rgb[2])];
  return color;
}
//# sourceMappingURL=parse-mtl.js.map