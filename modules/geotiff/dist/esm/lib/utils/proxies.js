const VIV_PROXY_KEY = '__viv';
const OFFSETS_PROXY_KEY = "".concat(VIV_PROXY_KEY, "-offsets");
const POOL_PROXY_KEY = "".concat(VIV_PROXY_KEY, "-decoder-pool");
export function checkProxies(tiff) {
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
export function createOffsetsProxy(tiff, offsets) {
  const get = (target, key) => {
    if (key === 'getImage') {
      return index => {
        if (!(index in target.ifdRequests) && index in offsets) {
          const offset = offsets[index];
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
    get
  });
}
export function createPoolProxy(tiff, pool) {
  const get = (target, key) => {
    if (key === 'readRasters') {
      return options => {
        return target.readRasters({
          ...options,
          pool
        });
      };
    }
    if (key === POOL_PROXY_KEY) {
      return true;
    }
    return Reflect.get(target, key);
  };
  return new Proxy(tiff, {
    get
  });
}
//# sourceMappingURL=proxies.js.map