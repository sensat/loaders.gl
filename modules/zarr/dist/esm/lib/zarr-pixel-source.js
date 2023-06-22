import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { BoundsCheckError, slice } from 'zarr';
import { getImageSize, isInterleaved, getIndexer } from './utils';
export const DTYPE_LOOKUP = {
  u1: 'Uint8',
  u2: 'Uint16',
  u4: 'Uint32',
  f4: 'Float32',
  f8: 'Float64',
  i1: 'Int8',
  i2: 'Int16',
  i4: 'Int32'
};
class ZarrPixelSource {
  constructor(data, labels, tileSize) {
    _defineProperty(this, "labels", void 0);
    _defineProperty(this, "tileSize", void 0);
    _defineProperty(this, "_data", void 0);
    _defineProperty(this, "_indexer", void 0);
    _defineProperty(this, "_readChunks", void 0);
    this._indexer = getIndexer(labels);
    this._data = data;
    const xChunkSize = data.chunks[this._xIndex];
    const yChunkSize = data.chunks[this._xIndex - 1];
    this._readChunks = tileSize === xChunkSize && tileSize === yChunkSize;
    this.labels = labels;
    this.tileSize = tileSize;
  }
  get shape() {
    return this._data.shape;
  }
  get dtype() {
    const suffix = this._data.dtype.slice(1);
    if (!(suffix in DTYPE_LOOKUP)) {
      throw Error("Zarr dtype not supported, got ".concat(suffix, "."));
    }
    return DTYPE_LOOKUP[suffix];
  }
  get _xIndex() {
    const interleave = isInterleaved(this._data.shape);
    return this._data.shape.length - (interleave ? 2 : 1);
  }
  _chunkIndex(selection, x, y) {
    const sel = this._indexer(selection);
    sel[this._xIndex] = x;
    sel[this._xIndex - 1] = y;
    return sel;
  }
  _getSlices(x, y) {
    const {
      height,
      width
    } = getImageSize(this);
    const [xStart, xStop] = [x * this.tileSize, Math.min((x + 1) * this.tileSize, width)];
    const [yStart, yStop] = [y * this.tileSize, Math.min((y + 1) * this.tileSize, height)];
    if (xStart === xStop || yStart === yStop) {
      throw new BoundsCheckError('Tile slice is zero-sized.');
    }
    return [slice(xStart, xStop), slice(yStart, yStop)];
  }
  async getRaster(_ref) {
    let {
      selection
    } = _ref;
    const sel = this._chunkIndex(selection, null, null);
    const {
      data,
      shape
    } = await this._data.getRaw(sel);
    const [height, width] = shape;
    return {
      data,
      width,
      height
    };
  }
  async getTile(props) {
    const {
      x,
      y,
      selection,
      signal
    } = props;
    let res;
    if (this._readChunks) {
      const sel = this._chunkIndex(selection, x, y);
      res = await this._data.getRawChunk(sel, {
        storeOptions: {
          signal
        }
      });
    } else {
      const [xSlice, ySlice] = this._getSlices(x, y);
      const sel = this._chunkIndex(selection, xSlice, ySlice);
      res = await this._data.getRaw(sel);
    }
    const {
      data,
      shape: [height, width]
    } = res;
    return {
      data,
      width,
      height
    };
  }
  onTileError(err) {
    if (!(err instanceof BoundsCheckError)) {
      throw err;
    }
  }
}
export default ZarrPixelSource;
//# sourceMappingURL=zarr-pixel-source.js.map