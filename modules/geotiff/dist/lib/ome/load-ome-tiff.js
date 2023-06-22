"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOmeTiff = exports.isOmeTiff = void 0;
const tiff_pixel_source_1 = __importDefault(require("../tiff-pixel-source"));
const ome_indexers_1 = require("./ome-indexers");
const ome_utils_1 = require("./ome-utils");
const omexml_1 = require("./omexml");
const isOmeTiff = (img) => img.fileDirectory.ImageDescription.includes('<OME');
exports.isOmeTiff = isOmeTiff;
async function loadOmeTiff(tiff, firstImage) {
    // Get first image from tiff and inspect OME-XML metadata
    const { ImageDescription, SubIFDs, PhotometricInterpretation: photometricInterpretation } = firstImage.fileDirectory;
    const omexml = (0, omexml_1.fromString)(ImageDescription);
    /*
     * Image pyramids are stored differently between versions of Bioformats.
     * Thus we need a different indexer depending on which format we have.
     */
    let levels;
    let pyramidIndexer;
    if (SubIFDs) {
        // Image is >= Bioformats 6.0 and resolutions are stored using SubIFDs.
        levels = SubIFDs.length + 1;
        pyramidIndexer = (0, ome_indexers_1.getOmeSubIFDIndexer)(tiff, omexml);
    }
    else {
        // Image is legacy format; resolutions are stored as separate images.
        levels = omexml.length;
        pyramidIndexer = (0, ome_indexers_1.getOmeLegacyIndexer)(tiff, omexml);
    }
    // TODO: The OmeTIFF loader only works for the _first_ image in the metadata.
    const imgMeta = omexml[0];
    const { labels, getShape, physicalSizes, dtype } = (0, ome_utils_1.getOmePixelSourceMeta)(imgMeta);
    const tileSize = firstImage.getTileWidth();
    const meta = { photometricInterpretation, physicalSizes };
    const data = Array.from({ length: levels }).map((_, resolution) => {
        const shape = getShape(resolution);
        const indexer = (sel) => pyramidIndexer(sel, resolution);
        const source = new tiff_pixel_source_1.default(indexer, dtype, tileSize, shape, labels, meta);
        return source;
    });
    return { data, metadata: imgMeta };
}
exports.loadOmeTiff = loadOmeTiff;
