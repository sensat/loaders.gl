"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DTYPE_LOOKUP = void 0;
const zarr_1 = require("zarr");
const utils_1 = require("./utils");
exports.DTYPE_LOOKUP = {
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
        this._indexer = (0, utils_1.getIndexer)(labels);
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
        if (!(suffix in exports.DTYPE_LOOKUP)) {
            throw Error(`Zarr dtype not supported, got ${suffix}.`);
        }
        return exports.DTYPE_LOOKUP[suffix];
    }
    get _xIndex() {
        const interleave = (0, utils_1.isInterleaved)(this._data.shape);
        return this._data.shape.length - (interleave ? 2 : 1);
    }
    _chunkIndex(selection, x, y) {
        const sel = this._indexer(selection);
        sel[this._xIndex] = x;
        sel[this._xIndex - 1] = y;
        return sel;
    }
    /**
     * Converts x, y tile indices to zarr dimension Slices within image bounds.
     */
    _getSlices(x, y) {
        const { height, width } = (0, utils_1.getImageSize)(this);
        const [xStart, xStop] = [x * this.tileSize, Math.min((x + 1) * this.tileSize, width)];
        const [yStart, yStop] = [y * this.tileSize, Math.min((y + 1) * this.tileSize, height)];
        // Deck.gl can sometimes request edge tiles that don't exist. We throw
        // a BoundsCheckError which is picked up in `ZarrPixelSource.onTileError`
        // and ignored by deck.gl.
        if (xStart === xStop || yStart === yStop) {
            throw new zarr_1.BoundsCheckError('Tile slice is zero-sized.');
        }
        return [(0, zarr_1.slice)(xStart, xStop), (0, zarr_1.slice)(yStart, yStop)];
    }
    async getRaster({ selection }) {
        const sel = this._chunkIndex(selection, null, null);
        const { data, shape } = (await this._data.getRaw(sel));
        const [height, width] = shape;
        return { data, width, height };
    }
    async getTile(props) {
        const { x, y, selection, signal } = props;
        let res;
        if (this._readChunks) {
            // Can read chunks directly by key since tile size matches chunk shape
            const sel = this._chunkIndex(selection, x, y);
            res = await this._data.getRawChunk(sel, { storeOptions: { signal } });
        }
        else {
            // Need to use zarr fancy indexing to get desired tile size.
            const [xSlice, ySlice] = this._getSlices(x, y);
            const sel = this._chunkIndex(selection, xSlice, ySlice);
            res = await this._data.getRaw(sel);
        }
        const { data, shape: [height, width] } = res;
        return { data, width, height };
    }
    onTileError(err) {
        if (!(err instanceof zarr_1.BoundsCheckError)) {
            // Rethrow error if something other than tile being requested is out of bounds.
            throw err;
        }
    }
}
exports.default = ZarrPixelSource;
