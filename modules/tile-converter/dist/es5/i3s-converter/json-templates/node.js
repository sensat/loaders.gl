"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NODE = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var COORDINATES = function COORDINATES() {
  return {
    mbs: {
      path: 'mbs'
    },
    obb: {
      path: 'obb'
    }
  };
};
var HREF = function HREF() {
  return {
    href: {
      path: 'href'
    }
  };
};
var PARENT_NODE = function PARENT_NODE() {
  return _objectSpread(_objectSpread({
    id: {
      path: 'id'
    }
  }, HREF()), COORDINATES());
};
var NODE = function NODE() {
  return _objectSpread(_objectSpread({
    version: {
      path: 'version'
    },
    id: {
      path: 'id'
    },
    path: {
      path: 'path'
    },
    level: {
      path: 'level'
    }
  }, COORDINATES()), {}, {
    lodSelection: {
      path: 'lodSelection',
      default: [{
        metricType: 'maxScreenThresholdSQ',
        maxError: 196349.54374999998
      }, {
        metricType: 'maxScreenThreshold',
        maxError: 999.99999999999994
      }]
    },
    children: {
      path: 'children',
      default: null
    },
    neighbors: {
      path: 'neighbors',
      default: null
    },
    parentNode: {
      path: 'parentNode',
      transform: function transform(val) {
        return (0, _jsonMapTransform.default)(val, PARENT_NODE());
      },
      default: null
    },
    sharedResource: {
      path: 'sharedResource',
      default: null
    },
    featureData: {
      path: 'featureData',
      default: null
    },
    geometryData: {
      path: 'geometryData',
      default: null
    },
    textureData: {
      path: 'textureData',
      default: null
    },
    attributeData: {
      path: 'attributeData',
      default: null
    }
  });
};
exports.NODE = NODE;
//# sourceMappingURL=node.js.map