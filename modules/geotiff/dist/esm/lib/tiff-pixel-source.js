import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { getImageSize, isInterleaved, SIGNAL_ABORTED } from './utils/tiff-utils';
class TiffPixelSource {
  constructor(indexer, dtype, tileSize, shape, labels, meta) {
    _defineProperty(this, "dtype", void 0);
    _defineProperty(this, "tileSize", void 0);
    _defineProperty(this, "shape", void 0);
    _defineProperty(this, "labels", void 0);
    _defineProperty(this, "meta", void 0);
    _defineProperty(this, "_indexer", void 0);
    this._indexer = indexer;
    this.dtype = dtype;
    this.tileSize = tileSize;
    this.shape = shape;
    this.labels = labels;
    this.meta = meta;
  }
  async getRaster(_ref) {
    let {
      selection,
      signal
    } = _ref;
    const image = await this._indexer(selection);
    return this._readRasters(image, {
      signal
    });
  }
  async getTile(_ref2) {
    let {
      x,
      y,
      selection,
      signal
    } = _ref2;
    const {
      height,
      width
    } = this._getTileExtent(x, y);
    const x0 = x * this.tileSize;
    const y0 = y * this.tileSize;
    const window = [x0, y0, x0 + width, y0 + height];
    const image = await this._indexer(selection);
    return this._readRasters(image, {
      window,
      width,
      height,
      signal
    });
  }
  async _readRasters(image, props) {
    var _props$signal;
    const interleave = isInterleaved(this.shape);
    const raster = await image.readRasters({
      interleave,
      ...props
    });
    if (props !== null && props !== void 0 && (_props$signal = props.signal) !== null && _props$signal !== void 0 && _props$signal.aborted) {
      throw SIGNAL_ABORTED;
    }
    const data = interleave ? raster : raster[0];
    return {
      data,
      width: raster.width,
      height: raster.height
    };
  }
  _getTileExtent(x, y) {
    const {
      height: zoomLevelHeight,
      width: zoomLevelWidth
    } = getImageSize(this);
    let height = this.tileSize;
    let width = this.tileSize;
    const maxXTileCoord = Math.floor(zoomLevelWidth / this.tileSize);
    const maxYTileCoord = Math.floor(zoomLevelHeight / this.tileSize);
    if (x === maxXTileCoord) {
      width = zoomLevelWidth % this.tileSize;
    }
    if (y === maxYTileCoord) {
      height = zoomLevelHeight % this.tileSize;
    }
    return {
      height,
      width
    };
  }
  onTileError(err) {
    console.error(err);
  }
}
export default TiffPixelSource;
//# sourceMappingURL=tiff-pixel-source.js.map