import { loadMultiscales, guessTileSize, guessLabels, normalizeStore, validLabels } from './utils';
import ZarrPixelSource from './zarr-pixel-source';
export async function loadZarr(root) {
  var _options$labels;
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const store = normalizeStore(root);
  const {
    data,
    rootAttrs
  } = await loadMultiscales(store);
  const tileSize = guessTileSize(data[0]);
  const labels = (_options$labels = options.labels) !== null && _options$labels !== void 0 ? _options$labels : guessLabels(rootAttrs);
  if (!validLabels(labels, data[0].shape)) {
    throw new Error('Invalid labels for Zarr array dimensions.');
  }
  const pyramid = data.map(arr => new ZarrPixelSource(arr, labels, tileSize));
  return {
    data: pyramid,
    metadata: rootAttrs
  };
}
//# sourceMappingURL=load-zarr.js.map