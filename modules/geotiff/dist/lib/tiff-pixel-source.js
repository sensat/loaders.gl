"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiff_utils_1 = require("./utils/tiff-utils");
class TiffPixelSource {
    // eslint-disable-next-line max-params
    constructor(indexer, dtype, tileSize, shape, labels, meta) {
        this._indexer = indexer;
        this.dtype = dtype;
        this.tileSize = tileSize;
        this.shape = shape;
        this.labels = labels;
        this.meta = meta;
    }
    async getRaster({ selection, signal }) {
        const image = await this._indexer(selection);
        return this._readRasters(image, { signal });
    }
    async getTile({ x, y, selection, signal }) {
        const { height, width } = this._getTileExtent(x, y);
        const x0 = x * this.tileSize;
        const y0 = y * this.tileSize;
        const window = [x0, y0, x0 + width, y0 + height];
        const image = await this._indexer(selection);
        return this._readRasters(image, { window, width, height, signal });
    }
    async _readRasters(image, props) {
        const interleave = (0, tiff_utils_1.isInterleaved)(this.shape);
        const raster = await image.readRasters({ interleave, ...props });
        if (props?.signal?.aborted) {
            throw tiff_utils_1.SIGNAL_ABORTED;
        }
        /*
         * geotiff.js returns objects with different structure
         * depending on `interleave`. It's weird, but this seems to work.
         */
        const data = (interleave ? raster : raster[0]);
        return {
            data,
            width: raster.width,
            height: raster.height
        };
    }
    /*
     * Computes tile size given x, y coord.
     */
    _getTileExtent(x, y) {
        const { height: zoomLevelHeight, width: zoomLevelWidth } = (0, tiff_utils_1.getImageSize)(this);
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
        return { height, width };
    }
    onTileError(err) {
        console.error(err); // eslint-disable-line no-console
    }
}
exports.default = TiffPixelSource;
