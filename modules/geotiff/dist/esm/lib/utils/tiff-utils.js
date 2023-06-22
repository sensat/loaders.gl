export function ensureArray(x) {
  return Array.isArray(x) ? x : [x];
}
export function intToRgba(int) {
  if (!Number.isInteger(int)) {
    throw Error('Not an integer.');
  }
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setInt32(0, int, false);
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes);
}
export function isInterleaved(shape) {
  const lastDimSize = shape[shape.length - 1];
  return lastDimSize === 3 || lastDimSize === 4;
}
export function getImageSize(source) {
  const interleaved = isInterleaved(source.shape);
  const [height, width] = source.shape.slice(interleaved ? -3 : -2);
  return {
    height,
    width
  };
}
export const SIGNAL_ABORTED = '__vivSignalAborted';
//# sourceMappingURL=tiff-utils.js.map