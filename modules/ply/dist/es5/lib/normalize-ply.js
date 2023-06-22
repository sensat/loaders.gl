"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizePLY;
var _schema = require("@loaders.gl/schema");
var _getPlySchema = require("./get-ply-schema");
function normalizePLY(plyHeader, plyAttributes, options) {
  var attributes = getMeshAttributes(plyAttributes);
  var boundingBox = (0, _schema.getMeshBoundingBox)(attributes);
  var vertexCount = plyAttributes.indices.length || plyAttributes.vertices.length / 3;
  var isTriangles = plyAttributes.indices && plyAttributes.indices.length > 0;
  var mode = isTriangles ? 4 : 0;
  var topology = isTriangles ? 'triangle-list' : 'point-list';
  var schema = (0, _getPlySchema.getPLYSchema)(plyHeader, attributes);
  var plyMesh = {
    loader: 'ply',
    loaderData: plyHeader,
    header: {
      vertexCount: vertexCount,
      boundingBox: boundingBox
    },
    schema: schema,
    attributes: attributes,
    indices: {
      value: new Uint32Array(0),
      size: 0
    },
    mode: mode,
    topology: topology
  };
  if (plyAttributes.indices.length > 0) {
    plyMesh.indices = {
      value: new Uint32Array(plyAttributes.indices),
      size: 1
    };
  }
  return plyMesh;
}
function getMeshAttributes(attributes) {
  var accessors = {};
  for (var _i = 0, _Object$keys = Object.keys(attributes); _i < _Object$keys.length; _i++) {
    var attributeName = _Object$keys[_i];
    switch (attributeName) {
      case 'vertices':
        if (attributes.vertices.length > 0) {
          accessors.POSITION = {
            value: new Float32Array(attributes.vertices),
            size: 3
          };
        }
        break;
      case 'normals':
        if (attributes.normals.length > 0) {
          accessors.NORMAL = {
            value: new Float32Array(attributes.normals),
            size: 3
          };
        }
        break;
      case 'uvs':
        if (attributes.uvs.length > 0) {
          accessors.TEXCOORD_0 = {
            value: new Float32Array(attributes.uvs),
            size: 2
          };
        }
        break;
      case 'colors':
        if (attributes.colors.length > 0) {
          accessors.COLOR_0 = {
            value: new Uint8Array(attributes.colors),
            size: 3,
            normalized: true
          };
        }
        break;
      case 'indices':
        break;
      default:
        if (attributes[attributeName].length > 0) {
          accessors[attributeName] = {
            value: new Float32Array(attributes[attributeName]),
            size: 1
          };
        }
        break;
    }
  }
  return accessors;
}
//# sourceMappingURL=normalize-ply.js.map