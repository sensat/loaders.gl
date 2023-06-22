"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validLabels = exports.joinUrlParts = exports.getImageSize = exports.getIndexer = exports.guessLabels = exports.guessTileSize = exports.isInterleaved = exports.getDims = exports.loadMultiscales = exports.normalizeStore = void 0;
const zarr_1 = require("zarr");
function normalizeStore(source) {
    if (typeof source === 'string') {
        return new zarr_1.HTTPStore(source);
    }
    return source;
}
exports.normalizeStore = normalizeStore;
async function loadMultiscales(store, path = '') {
    const grp = await (0, zarr_1.openGroup)(store, path);
    const rootAttrs = (await grp.attrs.asObject());
    // Root of Zarr store must implement multiscales extension.
    // https://github.com/zarr-developers/zarr-specs/issues/50
    if (!Array.isArray(rootAttrs.multiscales)) {
        throw new Error('Cannot find Zarr multiscales metadata.');
    }
    const { datasets } = rootAttrs.multiscales[0];
    const promises = datasets.map((d) => grp.getItem(d.path));
    return {
        data: await Promise.all(promises),
        rootAttrs
    };
}
exports.loadMultiscales = loadMultiscales;
/*
 * Creates an ES6 map of 'label' -> index
 * > const labels = ['a', 'b', 'c', 'd'];
 * > const dims = getDims(labels);
 * > dims('a') === 0;
 * > dims('b') === 1;
 * > dims('c') === 2;
 * > dims('hi!'); // throws
 */
function getDims(labels) {
    const lookup = new Map(labels.map((name, i) => [name, i]));
    if (lookup.size !== labels.length) {
        throw Error('Labels must be unique, found duplicated label.');
    }
    return (name) => {
        const index = lookup.get(name);
        if (index === undefined) {
            throw Error('Invalid dimension.');
        }
        return index;
    };
}
exports.getDims = getDims;
function prevPowerOf2(x) {
    return 2 ** Math.floor(Math.log2(x));
}
/*
 * Helper method to determine whether pixel data is interleaved or not.
 * > isInterleaved([1, 24, 24]) === false;
 * > isInterleaved([1, 24, 24, 3]) === true;
 */
function isInterleaved(shape) {
    const lastDimSize = shape[shape.length - 1];
    return lastDimSize === 3 || lastDimSize === 4;
}
exports.isInterleaved = isInterleaved;
function guessTileSize(arr) {
    const interleaved = isInterleaved(arr.shape);
    const [yChunk, xChunk] = arr.chunks.slice(interleaved ? -3 : -2);
    const size = Math.min(yChunk, xChunk);
    // deck.gl requirement for power-of-two tile size.
    return prevPowerOf2(size);
}
exports.guessTileSize = guessTileSize;
function guessLabels(rootAttrs) {
    if ('omero' in rootAttrs) {
        return ['t', 'c', 'z', 'y', 'x'];
    }
    throw new Error('Could not infer dimension labels for Zarr source. Must provide dimension labels.');
}
exports.guessLabels = guessLabels;
/*
 * The 'indexer' for a Zarr-based source translates
 * a 'selection' to an array of indices that align to
 * the labeled dimensions.
 *
 * > const labels = ['a', 'b', 'y', 'x'];
 * > const indexer = getIndexer(labels);
 * > console.log(indexer({ a: 10, b: 20 }));
 * > // [10, 20, 0, 0]
 */
function getIndexer(labels) {
    const size = labels.length;
    const dims = getDims(labels);
    return (sel) => {
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
exports.getIndexer = getIndexer;
function getImageSize(source) {
    const interleaved = isInterleaved(source.shape);
    // 2D image data in Zarr are represented as (..., rows, columns [, bands])
    // If an image is interleaved (RGB/A), we need to ignore the last dimension (bands)
    // to get the height and weight of the image.
    const [height, width] = source.shape.slice(interleaved ? -3 : -2);
    return { height, width };
}
exports.getImageSize = getImageSize;
/**
 * Preserves (double) slashes earlier in the path, so this works better
 * for URLs. From https://stackoverflow.com/a/46427607
 * @param args parts of a path or URL to join.
 */
function joinUrlParts(...args) {
    return args
        .map((part, i) => {
        if (i === 0)
            return part.trim().replace(/[/]*$/g, '');
        return part.trim().replace(/(^[/]*|[/]*$)/g, '');
    })
        .filter((x) => x.length)
        .join('/');
}
exports.joinUrlParts = joinUrlParts;
function validLabels(labels, shape) {
    if (labels.length !== shape.length) {
        throw new Error('Labels do not match Zarr array shape.');
    }
    const n = shape.length;
    if (isInterleaved(shape)) {
        // last three dimensions are [row, column, bands]
        return labels[n - 3] === 'y' && labels[n - 2] === 'x' && labels[n - 1] === '_c';
    }
    // last two dimensions are [row, column]
    return labels[n - 2] === 'y' && labels[n - 1] === 'x';
}
exports.validLabels = validLabels;
