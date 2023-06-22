"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGeoTiff = void 0;
const geotiff_1 = require("geotiff");
const proxies_1 = require("./utils/proxies");
// import Pool from './lib/Pool.js';
const load_ome_tiff_1 = require("./ome/load-ome-tiff");
/**
 * Opens an OME-TIFF via URL and returns data source and associated metadata for first image.
 *
 * @param source url string, File/Blob object, or GeoTIFF object
 * @param opts options for initializing a tiff pixel source.
 *  - `opts.headers` are passed to each underlying fetch request.
 *  - `opts.offsets` are a performance enhancment to index the remote tiff source using pre-computed byte-offsets.
 *  - `opts.pool` indicates whether a multi-threaded pool of image decoders should be used to decode tiles (default = true).
 * @return data source and associated OME-Zarr metadata.
 */
async function loadGeoTiff(source, opts = {}) {
    const { headers, offsets } = opts;
    // Create tiff source
    let tiff;
    if (source instanceof geotiff_1.GeoTIFF) {
        tiff = source;
    }
    else if (typeof source === 'string') {
        tiff = await (0, geotiff_1.fromUrl)(source, headers);
    }
    else {
        tiff = await (0, geotiff_1.fromBlob)(source);
    }
    // if (pool) {
    /*
     * Creates a worker pool to decode tiff tiles. Wraps tiff
     * in a Proxy that injects 'pool' into `tiff.readRasters`.
     */
    // tiff = createPoolProxy(tiff, new Pool());
    // }
    if (offsets) {
        /*
         * Performance enhancement. If offsets are provided, we
         * create a proxy that intercepts calls to `tiff.getImage`
         * and injects the pre-computed offsets.
         */
        tiff = (0, proxies_1.createOffsetsProxy)(tiff, offsets);
    }
    /*
     * Inspect tiff source for our performance enhancing proxies.
     * Prints warnings to console if `offsets` or `pool` are missing.
     */
    (0, proxies_1.checkProxies)(tiff);
    const firstImage = await tiff.getImage(0);
    if ((0, load_ome_tiff_1.isOmeTiff)(firstImage)) {
        return (0, load_ome_tiff_1.loadOmeTiff)(tiff, firstImage);
    }
    throw new Error('GeoTIFF not recognized.');
}
exports.loadGeoTiff = loadGeoTiff;
