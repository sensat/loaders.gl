"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TILESET = void 0;
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var ASSET = function ASSET() {
  return {
    version: {
      path: 'version',
      default: '1.0'
    }
  };
};
var TILE = function TILE() {
  return {
    boundingVolume: {
      path: 'boundingVolume'
    },
    geometricError: {
      path: 'geometricError'
    },
    content: {
      path: 'content'
    },
    children: {
      path: 'children',
      transform: function transform(val) {
        return val.map(function (tile) {
          return (0, _jsonMapTransform.default)(tile, TILE());
        });
      }
    }
  };
};
var TILESET = function TILESET() {
  return {
    asset: {
      path: 'asset',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, ASSET());
      }
    },
    geometricError: {
      path: 'root',
      transform: function transform(val) {
        return val.geometricError;
      }
    },
    root: {
      path: 'root',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, TILE());
      }
    }
  };
};
exports.TILESET = TILESET;
//# sourceMappingURL=tileset.js.map