import type { ZarrArray } from 'zarr';
import type { PixelSource, Labels, RasterSelection, PixelData, TileSelection } from '../types';
export declare const DTYPE_LOOKUP: {
    readonly u1: "Uint8";
    readonly u2: "Uint16";
    readonly u4: "Uint32";
    readonly f4: "Float32";
    readonly f8: "Float64";
    readonly i1: "Int8";
    readonly i2: "Int16";
    readonly i4: "Int32";
};
interface ZarrTileSelection {
    x: number;
    y: number;
    selection: number[];
    signal?: AbortSignal;
}
declare class ZarrPixelSource<S extends string[]> implements PixelSource<S> {
    labels: Labels<S>;
    tileSize: number;
    private _data;
    private _indexer;
    private _readChunks;
    constructor(data: ZarrArray, labels: Labels<S>, tileSize: number);
    get shape(): number[];
    get dtype(): "Uint8" | "Uint16" | "Uint32" | "Float32" | "Float64" | "Int8" | "Int16" | "Int32";
    private get _xIndex();
    private _chunkIndex;
    /**
     * Converts x, y tile indices to zarr dimension Slices within image bounds.
     */
    private _getSlices;
    getRaster({ selection }: RasterSelection<S> | {
        selection: number[];
    }): Promise<PixelData>;
    getTile(props: TileSelection<S> | ZarrTileSelection): Promise<PixelData>;
    onTileError(err: Error): void;
}
export default ZarrPixelSource;
//# sourceMappingURL=zarr-pixel-source.d.ts.map