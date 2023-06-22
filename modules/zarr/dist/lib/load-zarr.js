"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadZarr = void 0;
const utils_1 = require("./utils");
const zarr_pixel_source_1 = __importDefault(require("./zarr-pixel-source"));
async function loadZarr(root, options = {}) {
    const store = (0, utils_1.normalizeStore)(root);
    const { data, rootAttrs } = await (0, utils_1.loadMultiscales)(store);
    const tileSize = (0, utils_1.guessTileSize)(data[0]);
    // If no labels are provided, inspect the root attributes for the store.
    // For now, we only infer labels for OME-Zarr.
    const labels = options.labels ?? (0, utils_1.guessLabels)(rootAttrs);
    if (!(0, utils_1.validLabels)(labels, data[0].shape)) {
        throw new Error('Invalid labels for Zarr array dimensions.');
    }
    const pyramid = data.map((arr) => new zarr_pixel_source_1.default(arr, labels, tileSize));
    return {
        data: pyramid,
        metadata: rootAttrs
    };
}
exports.loadZarr = loadZarr;
