import { openGroup, HTTPStore } from 'zarr';
export function normalizeStore(source) {
  if (typeof source === 'string') {
    return new HTTPStore(source);
  }
  return source;
}
export async function loadMultiscales(store) {
  let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  const grp = await openGroup(store, path);
  const rootAttrs = await grp.attrs.asObject();
  if (!Array.isArray(rootAttrs.multiscales)) {
    throw new Error('Cannot find Zarr multiscales metadata.');
  }
  const {
    datasets
  } = rootAttrs.multiscales[0];
  const promises = datasets.map(d => grp.getItem(d.path));
  return {
    data: await Promise.all(promises),
    rootAttrs
  };
}
export function getDims(labels) {
  const lookup = new Map(labels.map((name, i) => [name, i]));
  if (lookup.size !== labels.length) {
    throw Error('Labels must be unique, found duplicated label.');
  }
  return name => {
    const index = lookup.get(name);
    if (index === undefined) {
      throw Error('Invalid dimension.');
    }
    return index;
  };
}
function prevPowerOf2(x) {
  return 2 ** Math.floor(Math.log2(x));
}
export function isInterleaved(shape) {
  const lastDimSize = shape[shape.length - 1];
  return lastDimSize === 3 || lastDimSize === 4;
}
export function guessTileSize(arr) {
  const interleaved = isInterleaved(arr.shape);
  const [yChunk, xChunk] = arr.chunks.slice(interleaved ? -3 : -2);
  const size = Math.min(yChunk, xChunk);
  return prevPowerOf2(size);
}
export function guessLabels(rootAttrs) {
  if ('omero' in rootAttrs) {
    return ['t', 'c', 'z', 'y', 'x'];
  }
  throw new Error('Could not infer dimension labels for Zarr source. Must provide dimension labels.');
}
export function getIndexer(labels) {
  const size = labels.length;
  const dims = getDims(labels);
  return sel => {
    if (Array.isArray(sel)) {
      return [...sel];
    }
    const selection = Array(size).fill(0);
    for (const [key, value] of Object.entries(sel)) {
      selection[dims(key)] = value;
    }
    return selection;
  };
}
export function getImageSize(source) {
  const interleaved = isInterleaved(source.shape);
  const [height, width] = source.shape.slice(interleaved ? -3 : -2);
  return {
    height,
    width
  };
}
export function joinUrlParts() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args.map((part, i) => {
    if (i === 0) return part.trim().replace(/[/]*$/g, '');
    return part.trim().replace(/(^[/]*|[/]*$)/g, '');
  }).filter(x => x.length).join('/');
}
export function validLabels(labels, shape) {
  if (labels.length !== shape.length) {
    throw new Error('Labels do not match Zarr array shape.');
  }
  const n = shape.length;
  if (isInterleaved(shape)) {
    return labels[n - 3] === 'y' && labels[n - 2] === 'x' && labels[n - 1] === '_c';
  }
  return labels[n - 2] === 'y' && labels[n - 1] === 'x';
}
//# sourceMappingURL=utils.js.map