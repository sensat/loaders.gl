import { fromUrl, fromBlob, GeoTIFF } from 'geotiff';
import { createOffsetsProxy, checkProxies } from './utils/proxies';
import { loadOmeTiff, isOmeTiff } from './ome/load-ome-tiff';
export async function loadGeoTiff(source) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    headers,
    offsets
  } = opts;
  let tiff;
  if (source instanceof GeoTIFF) {
    tiff = source;
  } else if (typeof source === 'string') {
    tiff = await fromUrl(source, headers);
  } else {
    tiff = await fromBlob(source);
  }
  if (offsets) {
    tiff = createOffsetsProxy(tiff, offsets);
  }
  checkProxies(tiff);
  const firstImage = await tiff.getImage(0);
  if (isOmeTiff(firstImage)) {
    return loadOmeTiff(tiff, firstImage);
  }
  throw new Error('GeoTIFF not recognized.');
}
//# sourceMappingURL=load-geotiff.js.map