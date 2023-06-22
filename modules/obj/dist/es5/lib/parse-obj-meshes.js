"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOBJMeshes = parseOBJMeshes;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var OBJECT_RE = /^[og]\s*(.+)?/;
var MATERIAL_RE = /^mtllib /;
var MATERIAL_USE_RE = /^usemtl /;
var MeshMaterial = function () {
  function MeshMaterial(_ref) {
    var index = _ref.index,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? '' : _ref$name,
      mtllib = _ref.mtllib,
      smooth = _ref.smooth,
      groupStart = _ref.groupStart;
    (0, _classCallCheck2.default)(this, MeshMaterial);
    this.index = index;
    this.name = name;
    this.mtllib = mtllib;
    this.smooth = smooth;
    this.groupStart = groupStart;
    this.groupEnd = -1;
    this.groupCount = -1;
    this.inherited = false;
  }
  (0, _createClass2.default)(MeshMaterial, [{
    key: "clone",
    value: function clone() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.index;
      return new MeshMaterial({
        index: index,
        name: this.name,
        mtllib: this.mtllib,
        smooth: this.smooth,
        groupStart: 0
      });
    }
  }]);
  return MeshMaterial;
}();
var MeshObject = function () {
  function MeshObject() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    (0, _classCallCheck2.default)(this, MeshObject);
    this.name = name;
    this.geometry = {
      vertices: [],
      normals: [],
      colors: [],
      uvs: []
    };
    this.materials = [];
    this.smooth = true;
    this.fromDeclaration = null;
  }
  (0, _createClass2.default)(MeshObject, [{
    key: "startMaterial",
    value: function startMaterial(name, libraries) {
      var previous = this._finalize(false);
      if (previous && (previous.inherited || previous.groupCount <= 0)) {
        this.materials.splice(previous.index, 1);
      }
      var material = new MeshMaterial({
        index: this.materials.length,
        name: name,
        mtllib: Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : '',
        smooth: previous !== undefined ? previous.smooth : this.smooth,
        groupStart: previous !== undefined ? previous.groupEnd : 0
      });
      this.materials.push(material);
      return material;
    }
  }, {
    key: "currentMaterial",
    value: function currentMaterial() {
      if (this.materials.length > 0) {
        return this.materials[this.materials.length - 1];
      }
      return undefined;
    }
  }, {
    key: "_finalize",
    value: function _finalize(end) {
      var lastMultiMaterial = this.currentMaterial();
      if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {
        lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
        lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
        lastMultiMaterial.inherited = false;
      }
      if (end && this.materials.length > 1) {
        for (var mi = this.materials.length - 1; mi >= 0; mi--) {
          if (this.materials[mi].groupCount <= 0) {
            this.materials.splice(mi, 1);
          }
        }
      }
      if (end && this.materials.length === 0) {
        this.materials.push({
          name: '',
          smooth: this.smooth
        });
      }
      return lastMultiMaterial;
    }
  }]);
  return MeshObject;
}();
var ParserState = function () {
  function ParserState() {
    (0, _classCallCheck2.default)(this, ParserState);
    this.objects = [];
    this.object = null;
    this.vertices = [];
    this.normals = [];
    this.colors = [];
    this.uvs = [];
    this.materialLibraries = [];
    this.startObject('', false);
  }
  (0, _createClass2.default)(ParserState, [{
    key: "startObject",
    value: function startObject(name) {
      var fromDeclaration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (this.object && !this.object.fromDeclaration) {
        this.object.name = name;
        this.object.fromDeclaration = fromDeclaration;
        return;
      }
      var previousMaterial = this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined;
      if (this.object && typeof this.object._finalize === 'function') {
        this.object._finalize(true);
      }
      this.object = new MeshObject(name);
      this.object.fromDeclaration = fromDeclaration;
      if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === 'function') {
        var declared = previousMaterial.clone(0);
        declared.inherited = true;
        this.object.materials.push(declared);
      }
      this.objects.push(this.object);
    }
  }, {
    key: "finalize",
    value: function finalize() {
      if (this.object && typeof this.object._finalize === 'function') {
        this.object._finalize(true);
      }
    }
  }, {
    key: "parseVertexIndex",
    value: function parseVertexIndex(value, len) {
      var index = parseInt(value);
      return (index >= 0 ? index - 1 : index + len / 3) * 3;
    }
  }, {
    key: "parseNormalIndex",
    value: function parseNormalIndex(value, len) {
      var index = parseInt(value);
      return (index >= 0 ? index - 1 : index + len / 3) * 3;
    }
  }, {
    key: "parseUVIndex",
    value: function parseUVIndex(value, len) {
      var index = parseInt(value);
      return (index >= 0 ? index - 1 : index + len / 2) * 2;
    }
  }, {
    key: "addVertex",
    value: function addVertex(a, b, c) {
      var src = this.vertices;
      var dst = this.object.geometry.vertices;
      dst.push(src[a + 0], src[a + 1], src[a + 2]);
      dst.push(src[b + 0], src[b + 1], src[b + 2]);
      dst.push(src[c + 0], src[c + 1], src[c + 2]);
    }
  }, {
    key: "addVertexPoint",
    value: function addVertexPoint(a) {
      var src = this.vertices;
      var dst = this.object.geometry.vertices;
      dst.push(src[a + 0], src[a + 1], src[a + 2]);
    }
  }, {
    key: "addVertexLine",
    value: function addVertexLine(a) {
      var src = this.vertices;
      var dst = this.object.geometry.vertices;
      dst.push(src[a + 0], src[a + 1], src[a + 2]);
    }
  }, {
    key: "addNormal",
    value: function addNormal(a, b, c) {
      var src = this.normals;
      var dst = this.object.geometry.normals;
      dst.push(src[a + 0], src[a + 1], src[a + 2]);
      dst.push(src[b + 0], src[b + 1], src[b + 2]);
      dst.push(src[c + 0], src[c + 1], src[c + 2]);
    }
  }, {
    key: "addColor",
    value: function addColor(a, b, c) {
      var src = this.colors;
      var dst = this.object.geometry.colors;
      dst.push(src[a + 0], src[a + 1], src[a + 2]);
      dst.push(src[b + 0], src[b + 1], src[b + 2]);
      dst.push(src[c + 0], src[c + 1], src[c + 2]);
    }
  }, {
    key: "addUV",
    value: function addUV(a, b, c) {
      var src = this.uvs;
      var dst = this.object.geometry.uvs;
      dst.push(src[a + 0], src[a + 1]);
      dst.push(src[b + 0], src[b + 1]);
      dst.push(src[c + 0], src[c + 1]);
    }
  }, {
    key: "addUVLine",
    value: function addUVLine(a) {
      var src = this.uvs;
      var dst = this.object.geometry.uvs;
      dst.push(src[a + 0], src[a + 1]);
    }
  }, {
    key: "addFace",
    value: function addFace(a, b, c, ua, ub, uc, na, nb, nc) {
      var vLen = this.vertices.length;
      var ia = this.parseVertexIndex(a, vLen);
      var ib = this.parseVertexIndex(b, vLen);
      var ic = this.parseVertexIndex(c, vLen);
      this.addVertex(ia, ib, ic);
      if (ua !== undefined && ua !== '') {
        var uvLen = this.uvs.length;
        ia = this.parseUVIndex(ua, uvLen);
        ib = this.parseUVIndex(ub, uvLen);
        ic = this.parseUVIndex(uc, uvLen);
        this.addUV(ia, ib, ic);
      }
      if (na !== undefined && na !== '') {
        var nLen = this.normals.length;
        ia = this.parseNormalIndex(na, nLen);
        ib = na === nb ? ia : this.parseNormalIndex(nb, nLen);
        ic = na === nc ? ia : this.parseNormalIndex(nc, nLen);
        this.addNormal(ia, ib, ic);
      }
      if (this.colors.length > 0) {
        this.addColor(ia, ib, ic);
      }
    }
  }, {
    key: "addPointGeometry",
    value: function addPointGeometry(vertices) {
      this.object.geometry.type = 'Points';
      var vLen = this.vertices.length;
      var _iterator = _createForOfIteratorHelper(vertices),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var vertex = _step.value;
          this.addVertexPoint(this.parseVertexIndex(vertex, vLen));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "addLineGeometry",
    value: function addLineGeometry(vertices, uvs) {
      this.object.geometry.type = 'Line';
      var vLen = this.vertices.length;
      var uvLen = this.uvs.length;
      var _iterator2 = _createForOfIteratorHelper(vertices),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var vertex = _step2.value;
          this.addVertexLine(this.parseVertexIndex(vertex, vLen));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var _iterator3 = _createForOfIteratorHelper(uvs),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var uv = _step3.value;
          this.addUVLine(this.parseUVIndex(uv, uvLen));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }]);
  return ParserState;
}();
function parseOBJMeshes(text) {
  var state = new ParserState();
  if (text.indexOf('\r\n') !== -1) {
    text = text.replace(/\r\n/g, '\n');
  }
  if (text.indexOf('\\\n') !== -1) {
    text = text.replace(/\\\n/g, '');
  }
  var lines = text.split('\n');
  var line = '';
  var lineFirstChar = '';
  var lineLength = 0;
  var result = [];
  var trimLeft = typeof ''.trimLeft === 'function';
  for (var i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    line = trimLeft ? line.trimLeft() : line.trim();
    lineLength = line.length;
    if (lineLength === 0) continue;
    lineFirstChar = line.charAt(0);
    if (lineFirstChar === '#') continue;
    if (lineFirstChar === 'v') {
      var data = line.split(/\s+/);
      switch (data[0]) {
        case 'v':
          state.vertices.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
          if (data.length === 8) {
            state.colors.push(parseFloat(data[4]), parseFloat(data[5]), parseFloat(data[6]));
          }
          break;
        case 'vn':
          state.normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
          break;
        case 'vt':
          state.uvs.push(parseFloat(data[1]), parseFloat(data[2]));
          break;
        default:
      }
    } else if (lineFirstChar === 'f') {
      var lineData = line.substr(1).trim();
      var vertexData = lineData.split(/\s+/);
      var faceVertices = [];
      for (var j = 0, jl = vertexData.length; j < jl; j++) {
        var vertex = vertexData[j];
        if (vertex.length > 0) {
          var vertexParts = vertex.split('/');
          faceVertices.push(vertexParts);
        }
      }
      var v1 = faceVertices[0];
      for (var _j = 1, _jl = faceVertices.length - 1; _j < _jl; _j++) {
        var v2 = faceVertices[_j];
        var v3 = faceVertices[_j + 1];
        state.addFace(v1[0], v2[0], v3[0], v1[1], v2[1], v3[1], v1[2], v2[2], v3[2]);
      }
    } else if (lineFirstChar === 'l') {
      var lineParts = line.substring(1).trim().split(' ');
      var lineVertices = void 0;
      var lineUVs = [];
      if (line.indexOf('/') === -1) {
        lineVertices = lineParts;
      } else {
        lineVertices = [];
        for (var li = 0, llen = lineParts.length; li < llen; li++) {
          var parts = lineParts[li].split('/');
          if (parts[0] !== '') lineVertices.push(parts[0]);
          if (parts[1] !== '') lineUVs.push(parts[1]);
        }
      }
      state.addLineGeometry(lineVertices, lineUVs);
    } else if (lineFirstChar === 'p') {
      var _lineData = line.substr(1).trim();
      var pointData = _lineData.split(' ');
      state.addPointGeometry(pointData);
    } else if ((result = OBJECT_RE.exec(line)) !== null) {
      var name = (' ' + result[0].substr(1).trim()).substr(1);
      state.startObject(name);
    } else if (MATERIAL_USE_RE.test(line)) {
      state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
    } else if (MATERIAL_RE.test(line)) {
      state.materialLibraries.push(line.substring(7).trim());
    } else if (lineFirstChar === 's') {
      result = line.split(' ');
      if (result.length > 1) {
        var value = result[1].trim().toLowerCase();
        state.object.smooth = value !== '0' && value !== 'off';
      } else {
        state.object.smooth = true;
      }
      var material = state.object.currentMaterial();
      if (material) material.smooth = state.object.smooth;
    } else {
      if (line === '\0') continue;
      throw new Error("Unexpected line: \"".concat(line, "\""));
    }
  }
  state.finalize();
  var meshes = [];
  var materials = [];
  var _iterator4 = _createForOfIteratorHelper(state.objects),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var object = _step4.value;
      var geometry = object.geometry;
      if (geometry.vertices.length === 0) continue;
      var mesh = {
        header: {
          vertexCount: geometry.vertices.length / 3
        },
        attributes: {}
      };
      switch (geometry.type) {
        case 'Points':
          mesh.mode = 0;
          break;
        case 'Line':
          mesh.mode = 1;
          break;
        default:
          mesh.mode = 4;
          break;
      }
      mesh.attributes.POSITION = {
        value: new Float32Array(geometry.vertices),
        size: 3
      };
      if (geometry.normals.length > 0) {
        mesh.attributes.NORMAL = {
          value: new Float32Array(geometry.normals),
          size: 3
        };
      }
      if (geometry.colors.length > 0) {
        mesh.attributes.COLOR_0 = {
          value: new Float32Array(geometry.colors),
          size: 3
        };
      }
      if (geometry.uvs.length > 0) {
        mesh.attributes.TEXCOORD_0 = {
          value: new Float32Array(geometry.uvs),
          size: 2
        };
      }
      mesh.materials = [];
      var _iterator5 = _createForOfIteratorHelper(object.materials),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var sourceMaterial = _step5.value;
          var _material = {
            name: sourceMaterial.name,
            flatShading: !sourceMaterial.smooth
          };
          mesh.materials.push(_material);
          materials.push(_material);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      mesh.name = object.name;
      meshes.push(mesh);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return {
    meshes: meshes,
    materials: materials
  };
}
//# sourceMappingURL=parse-obj-meshes.js.map