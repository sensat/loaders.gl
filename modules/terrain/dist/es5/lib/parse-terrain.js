"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeTerrainMeshFromImage = makeTerrainMeshFromImage;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _schema = require("@loaders.gl/schema");
var _martini = _interopRequireDefault(require("@mapbox/martini"));
var _delatin = _interopRequireDefault(require("./delatin"));
var _skirt = require("./helpers/skirt");
function makeTerrainMeshFromImage(terrainImage, terrainOptions) {
  var meshMaxError = terrainOptions.meshMaxError,
    bounds = terrainOptions.bounds,
    elevationDecoder = terrainOptions.elevationDecoder;
  var data = terrainImage.data,
    width = terrainImage.width,
    height = terrainImage.height;
  var terrain;
  var mesh;
  switch (terrainOptions.tesselator) {
    case 'martini':
      terrain = getTerrain(data, width, height, elevationDecoder, terrainOptions.tesselator);
      mesh = getMartiniTileMesh(meshMaxError, width, terrain);
      break;
    case 'delatin':
      terrain = getTerrain(data, width, height, elevationDecoder, terrainOptions.tesselator);
      mesh = getDelatinTileMesh(meshMaxError, width, height, terrain);
      break;
    default:
      if (width === height && !(height & width - 1)) {
        terrain = getTerrain(data, width, height, elevationDecoder, 'martini');
        mesh = getMartiniTileMesh(meshMaxError, width, terrain);
      } else {
        terrain = getTerrain(data, width, height, elevationDecoder, 'delatin');
        mesh = getDelatinTileMesh(meshMaxError, width, height, terrain);
      }
      break;
  }
  var _mesh = mesh,
    vertices = _mesh.vertices;
  var _mesh2 = mesh,
    triangles = _mesh2.triangles;
  var attributes = getMeshAttributes(vertices, terrain, width, height, bounds);
  var boundingBox = (0, _schema.getMeshBoundingBox)(attributes);
  if (terrainOptions.skirtHeight) {
    var _addSkirt = (0, _skirt.addSkirt)(attributes, triangles, terrainOptions.skirtHeight),
      newAttributes = _addSkirt.attributes,
      newTriangles = _addSkirt.triangles;
    attributes = newAttributes;
    triangles = newTriangles;
  }
  return {
    loaderData: {
      header: {}
    },
    header: {
      vertexCount: triangles.length,
      boundingBox: boundingBox
    },
    mode: 4,
    indices: {
      value: Uint32Array.from(triangles),
      size: 1
    },
    attributes: attributes
  };
}
function getMartiniTileMesh(meshMaxError, width, terrain) {
  var gridSize = width + 1;
  var martini = new _martini.default(gridSize);
  var tile = martini.createTile(terrain);
  var _tile$getMesh = tile.getMesh(meshMaxError),
    vertices = _tile$getMesh.vertices,
    triangles = _tile$getMesh.triangles;
  return {
    vertices: vertices,
    triangles: triangles
  };
}
function getDelatinTileMesh(meshMaxError, width, height, terrain) {
  var tin = new _delatin.default(terrain, width + 1, height + 1);
  tin.run(meshMaxError);
  var coords = tin.coords,
    triangles = tin.triangles;
  var vertices = coords;
  return {
    vertices: vertices,
    triangles: triangles
  };
}
function getTerrain(imageData, width, height, elevationDecoder, tesselator) {
  var rScaler = elevationDecoder.rScaler,
    bScaler = elevationDecoder.bScaler,
    gScaler = elevationDecoder.gScaler,
    offset = elevationDecoder.offset;
  var terrain = new Float32Array((width + 1) * (height + 1));
  for (var i = 0, y = 0; y < height; y++) {
    for (var x = 0; x < width; x++, i++) {
      var k = i * 4;
      var r = imageData[k + 0];
      var g = imageData[k + 1];
      var b = imageData[k + 2];
      terrain[i + y] = r * rScaler + g * gScaler + b * bScaler + offset;
    }
  }
  if (tesselator === 'martini') {
    for (var _i = (width + 1) * width, _x = 0; _x < width; _x++, _i++) {
      terrain[_i] = terrain[_i - width - 1];
    }
    for (var _i2 = height, _y = 0; _y < height + 1; _y++, _i2 += height + 1) {
      terrain[_i2] = terrain[_i2 - 1];
    }
  }
  return terrain;
}
function getMeshAttributes(vertices, terrain, width, height, bounds) {
  var gridSize = width + 1;
  var numOfVerticies = vertices.length / 2;
  var positions = new Float32Array(numOfVerticies * 3);
  var texCoords = new Float32Array(numOfVerticies * 2);
  var _ref = bounds || [0, 0, width, height],
    _ref2 = (0, _slicedToArray2.default)(_ref, 4),
    minX = _ref2[0],
    minY = _ref2[1],
    maxX = _ref2[2],
    maxY = _ref2[3];
  var xScale = (maxX - minX) / width;
  var yScale = (maxY - minY) / height;
  for (var i = 0; i < numOfVerticies; i++) {
    var x = vertices[i * 2];
    var y = vertices[i * 2 + 1];
    var pixelIdx = y * gridSize + x;
    positions[3 * i + 0] = x * xScale + minX;
    positions[3 * i + 1] = -y * yScale + maxY;
    positions[3 * i + 2] = terrain[pixelIdx];
    texCoords[2 * i + 0] = x / width;
    texCoords[2 * i + 1] = y / height;
  }
  return {
    POSITION: {
      value: positions,
      size: 3
    },
    TEXCOORD_0: {
      value: texCoords,
      size: 2
    }
  };
}
//# sourceMappingURL=parse-terrain.js.map