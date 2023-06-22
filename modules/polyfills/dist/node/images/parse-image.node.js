"use strict";
// loaders.gl, MIT license
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImageNode = exports.NODE_FORMAT_SUPPORT = void 0;
const get_pixels_1 = __importDefault(require("get-pixels"));
/** Declares which image format mime types this loader polyfill supports */
exports.NODE_FORMAT_SUPPORT = ['image/png', 'image/jpeg', 'image/gif'];
async function parseImageNode(arrayBuffer, mimeType) {
    if (!mimeType) {
        throw new Error('MIMEType is required to parse image under Node.js');
    }
    const buffer = arrayBuffer instanceof Buffer ? arrayBuffer : Buffer.from(arrayBuffer);
    const ndarray = await getPixelsAsync(buffer, mimeType);
    return ndarray;
}
exports.parseImageNode = parseImageNode;
// TODO - check if getPixels callback is asynchronous if provided with buffer input
// if not, parseImage can be a sync function
function getPixelsAsync(buffer, mimeType) {
    return new Promise((resolve) => (0, get_pixels_1.default)(buffer, mimeType, (err, ndarray) => {
        if (err) {
            throw err;
        }
        const shape = [...ndarray.shape];
        const layers = ndarray.shape.length === 4 ? ndarray.shape.shift() : 1;
        const data = ndarray.data instanceof Buffer ? new Uint8Array(ndarray.data) : ndarray.data;
        // extract width/height etc
        resolve({
            shape,
            data,
            width: ndarray.shape[0],
            height: ndarray.shape[1],
            components: ndarray.shape[2],
            // TODO - error
            layers: layers ? [layers] : []
        });
    }));
}
