"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkProxies = checkProxies;
exports.createOffsetsProxy = createOffsetsProxy;
exports.createPoolProxy = createPoolProxy;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var VIV_PROXY_KEY = '__viv';
var OFFSETS_PROXY_KEY = "".concat(VIV_PROXY_KEY, "-offsets");
var POOL_PROXY_KEY = "".concat(VIV_PROXY_KEY, "-decoder-pool");
function checkProxies(tiff) {
  if (!isProxy(tiff, OFFSETS_PROXY_KEY)) {
    console.warn('GeoTIFF source is missing offsets proxy.');
  }
  if (!isProxy(tiff, POOL_PROXY_KEY)) {
    console.warn('GeoTIFF source is missing decoder-pool proxy.');
  }
}
function isProxy(tiff, proxyFlag) {
  return tiff[proxyFlag];
}
function createOffsetsProxy(tiff, offsets) {
  var get = function get(target, key) {
    if (key === 'getImage') {
      return function (index) {
        if (!(index in target.ifdRequests) && index in offsets) {
          var offset = offsets[index];
          target.ifdRequests[index] = target.parseFileDirectoryAt(offset);
        }
        return target.getImage(index);
      };
    }
    if (key === OFFSETS_PROXY_KEY) {
      return true;
    }
    return Reflect.get(target, key);
  };
  return new Proxy(tiff, {
    get: get
  });
}
function createPoolProxy(tiff, pool) {
  var get = function get(target, key) {
    if (key === 'readRasters') {
      return function (options) {
        return target.readRasters(_objectSpread(_objectSpread({}, options), {}, {
          pool: pool
        }));
      };
    }
    if (key === POOL_PROXY_KEY) {
      return true;
    }
    return Reflect.get(target, key);
  };
  return new Proxy(tiff, {
    get: get
  });
}
//# sourceMappingURL=proxies.js.map