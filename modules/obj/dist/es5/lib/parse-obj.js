"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOBJ = parseOBJ;
var _schema = require("@loaders.gl/schema");
var _parseObjMeshes = require("./parse-obj-meshes");
var _getObjSchema = require("./get-obj-schema");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function parseOBJ(text, options) {
  var _parseOBJMeshes = (0, _parseObjMeshes.parseOBJMeshes)(text),
    meshes = _parseOBJMeshes.meshes;
  var vertexCount = meshes.reduce(function (s, mesh) {
    return s + mesh.header.vertexCount;
  }, 0);
  var attributes = mergeAttributes(meshes, vertexCount);
  var header = {
    vertexCount: vertexCount,
    boundingBox: (0, _schema.getMeshBoundingBox)(attributes)
  };
  var schema = (0, _getObjSchema.getOBJSchema)(attributes, {
    mode: 4,
    boundingBox: header.boundingBox
  });
  return {
    loaderData: {
      header: {}
    },
    schema: schema,
    header: header,
    mode: 4,
    topology: 'point-list',
    attributes: attributes
  };
}
function mergeAttributes(meshes, vertexCount) {
  var positions = new Float32Array(vertexCount * 3);
  var normals;
  var colors;
  var uvs;
  var i = 0;
  var _iterator = _createForOfIteratorHelper(meshes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mesh = _step.value;
      var _mesh$attributes = mesh.attributes,
        POSITION = _mesh$attributes.POSITION,
        NORMAL = _mesh$attributes.NORMAL,
        COLOR_0 = _mesh$attributes.COLOR_0,
        TEXCOORD_0 = _mesh$attributes.TEXCOORD_0;
      positions.set(POSITION.value, i * 3);
      if (NORMAL) {
        normals = normals || new Float32Array(vertexCount * 3);
        normals.set(NORMAL.value, i * 3);
      }
      if (COLOR_0) {
        colors = colors || new Float32Array(vertexCount * 3);
        colors.set(COLOR_0.value, i * 3);
      }
      if (TEXCOORD_0) {
        uvs = uvs || new Float32Array(vertexCount * 2);
        uvs.set(TEXCOORD_0.value, i * 2);
      }
      i += POSITION.value.length / 3;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var attributes = {};
  attributes.POSITION = {
    value: positions,
    size: 3
  };
  if (normals) {
    attributes.NORMAL = {
      value: normals,
      size: 3
    };
  }
  if (colors) {
    attributes.COLOR_0 = {
      value: colors,
      size: 3
    };
  }
  if (uvs) {
    attributes.TEXCOORD_0 = {
      value: uvs,
      size: 2
    };
  }
  return attributes;
}
//# sourceMappingURL=parse-obj.js.map