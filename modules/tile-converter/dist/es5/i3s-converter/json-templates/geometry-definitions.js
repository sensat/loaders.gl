"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GEOMETRY_DEFINITION = void 0;
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var PLAIN_GEOMETRY_DEFINITION = function PLAIN_GEOMETRY_DEFINITION() {
  return {
    offset: {
      default: 8
    },
    position: {
      default: {
        type: 'Float32',
        component: 3
      }
    },
    normal: {
      default: {
        type: 'Float32',
        component: 3
      }
    },
    uv0: {
      path: 'hasTexture',
      transform: function transform(val) {
        return val && {
          type: 'Float32',
          component: 2
        } || false;
      },
      omitValues: [false]
    },
    color: {
      default: {
        type: 'UInt8',
        component: 4
      }
    },
    uvRegion: {
      path: 'hasUvRegions',
      transform: function transform(val) {
        return val && {
          type: 'UInt16',
          component: 4
        } || false;
      },
      omitValues: [false]
    },
    featureId: {
      default: {
        binding: 'per-feature',
        type: 'UInt64',
        component: 1
      }
    },
    faceRange: {
      default: {
        binding: 'per-feature',
        type: 'UInt32',
        component: 2
      }
    }
  };
};
var COMPRESSED_GEOMETRY_DEFINITION = function COMPRESSED_GEOMETRY_DEFINITION() {
  return {
    'compressedAttributes.encoding': {
      default: 'draco'
    },
    'compressedAttributes.attributes': {
      path: 'geometryConfig',
      transform: function transform(val) {
        var result = ['position', 'normal'];
        if (val.hasTexture) {
          result.push('uv0');
        }
        result.push('color');
        if (val.hasUvRegions) {
          result.push('uv-region');
        }
        result.push('feature-index');
        return result;
      }
    }
  };
};
var GEOMETRY_DEFINITION = function GEOMETRY_DEFINITION() {
  return {
    geometryBuffers: {
      path: 'geometryConfig',
      transform: function transform(val) {
        var result = [(0, _jsonMapTransform.default)(val, PLAIN_GEOMETRY_DEFINITION())];
        if (val.draco) {
          result.push((0, _jsonMapTransform.default)({
            geometryConfig: val
          }, COMPRESSED_GEOMETRY_DEFINITION()));
        }
        return result;
      }
    }
  };
};
exports.GEOMETRY_DEFINITION = GEOMETRY_DEFINITION;
//# sourceMappingURL=geometry-definitions.js.map