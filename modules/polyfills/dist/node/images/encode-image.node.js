"use strict";
// Use stackgl modules for DOM-less reading and writing of images
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeImageNode = exports.encodeImageToStreamNode = void 0;
const save_pixels_1 = __importDefault(require("save-pixels"));
const ndarray_1 = __importDefault(require("ndarray"));
const to_array_buffer_node_1 = require("../buffer/to-array-buffer.node");
/**
 * Returns data bytes representing a compressed image in PNG or JPG format,
 * This data can be saved using file system (f) methods or
 * used in a request.
 * @param image to save
 * @param options
 * @param options.type='png' - png, jpg or image/png, image/jpg are valid
 * @param options.dataURI - Whether to include a data URI header
 * @return {*} bytes
 */
function encodeImageToStreamNode(image, options) {
    // Support MIME type strings
    const type = options.type ? options.type.replace('image/', '') : 'jpeg';
    const pixels = (0, ndarray_1.default)(image.data, [image.width, image.height, 4], [4, image.width * 4, 1], 0);
    // Note: savePixels returns a stream
    return (0, save_pixels_1.default)(pixels, type, options);
}
exports.encodeImageToStreamNode = encodeImageToStreamNode;
function encodeImageNode(image, options) {
    const imageStream = encodeImageToStreamNode(image, options);
    return new Promise((resolve) => {
        const buffers = [];
        imageStream.on('data', (buffer) => buffers.push(buffer));
        // TODO - convert to arraybuffer?
        imageStream.on('end', () => {
            const buffer = Buffer.concat(buffers);
            resolve((0, to_array_buffer_node_1.bufferToArrayBuffer)(buffer));
        });
    });
}
exports.encodeImageNode = encodeImageNode;
