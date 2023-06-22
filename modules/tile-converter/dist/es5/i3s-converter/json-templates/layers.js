"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LAYERS = void 0;
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var _store = require("./store");
var SPATIAL_REFERENCE = function SPATIAL_REFERENCE() {
  return {
    wkid: {
      path: 'wkid',
      default: 4326
    },
    latestWkid: {
      path: 'latestWkid',
      default: 4326
    },
    vcsWkid: {
      path: 'vcsWkid',
      default: 5773
    },
    latestVcsWkid: {
      path: 'latestVcsWkid',
      default: 5773
    }
  };
};
var HEIGHT_MODEL_INFO = function HEIGHT_MODEL_INFO() {
  return {
    heightModel: {
      path: 'heightModel',
      default: 'gravity_related_height'
    },
    vertCRS: {
      path: 'vertCRS',
      default: 'EGM96_Geoid'
    },
    heightUnit: {
      path: 'heightUnit',
      default: 'meter'
    }
  };
};
var NODE_PAGES = function NODE_PAGES() {
  return {
    nodesPerPage: {
      path: 'nodesPerPage'
    },
    lodSelectionMetricType: {
      path: 'lodSelectionMetricType',
      default: 'maxScreenThresholdSQ'
    }
  };
};
var FULL_EXTENT = function FULL_EXTENT() {
  return {
    xmin: {
      path: 'xmin'
    },
    ymin: {
      path: 'ymin'
    },
    xmax: {
      path: 'xmax'
    },
    ymax: {
      path: 'ymax'
    },
    zmin: {
      path: 'zmin'
    },
    zmax: {
      path: 'zmax'
    }
  };
};
var LAYERS = function LAYERS() {
  return {
    version: {
      path: 'version',
      transform: function transform(val) {
        return val.toUpperCase();
      }
    },
    id: {
      path: 'id',
      default: 0
    },
    name: {
      path: 'name'
    },
    href: {
      path: 'href',
      default: './layers/0'
    },
    layerType: {
      path: 'layerType',
      default: 'IntegratedMesh'
    },
    spatialReference: {
      path: 'spatialReference',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, SPATIAL_REFERENCE());
      }
    },
    capabilities: {
      path: 'capabilities',
      default: ['View', 'Query']
    },
    store: {
      path: 'store',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, _store.STORE);
      }
    },
    fullExtent: {
      path: 'fullExtent',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, FULL_EXTENT());
      }
    },
    heightModelInfo: {
      path: 'heightModelInfo',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, HEIGHT_MODEL_INFO());
      }
    },
    nodePages: {
      path: 'nodePages',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, NODE_PAGES());
      }
    },
    materialDefinitions: {
      path: 'materialDefinitions',
      default: []
    },
    textureSetDefinitions: {
      path: 'textureSetDefinitions',
      default: []
    },
    geometryDefinitions: {
      path: 'geometryDefinitions',
      default: []
    },
    attributeStorageInfo: {
      path: 'attributeStorageInfo',
      default: []
    },
    fields: {
      path: 'fields',
      default: []
    },
    popupInfo: {
      path: 'popupInfo',
      default: null
    }
  };
};
exports.LAYERS = LAYERS;
//# sourceMappingURL=layers.js.map