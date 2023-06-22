"use strict";
// loaders.gl, MIT license
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFileNode = exports.isRequestURL = void 0;
const fs_1 = __importDefault(require("fs")); // `fs` will be empty object in browsers (see package.json "browser" field).
const response_node_1 = require("./response.node");
const headers_node_1 = require("./headers.node");
function isRequestURL(url) {
    return url.startsWith('http:') || url.startsWith('https:');
}
exports.isRequestURL = isRequestURL;
async function fetchFileNode(url, options) {
    const noqueryUrl = url.split('?')[0];
    try {
        // Now open the stream
        const body = await new Promise((resolve, reject) => {
            // @ts-ignore
            const stream = fs_1.default.createReadStream(noqueryUrl, { encoding: null });
            stream.once('readable', () => resolve(stream));
            stream.on('error', (error) => reject(error));
        });
        const status = 200;
        const statusText = 'OK';
        const headers = getHeadersForFile(noqueryUrl);
        return new response_node_1.Response(body, { headers, status, statusText, url });
    }
    catch (error) {
        const status = 400;
        const statusText = error.message;
        const headers = {};
        return new response_node_1.Response(error.message, { headers, status, statusText, url });
    }
}
exports.fetchFileNode = fetchFileNode;
function getHeadersForFile(noqueryUrl) {
    const headers = {};
    // Fix up content length if we can for best progress experience
    if (!headers['content-length']) {
        const stats = fs_1.default.statSync(noqueryUrl);
        headers['content-length'] = stats.size;
    }
    // Automatically decompress gzipped files with .gz extension
    if (noqueryUrl.endsWith('.gz')) {
        noqueryUrl = noqueryUrl.slice(0, -3);
        headers['content-encoding'] = 'gzip';
    }
    return new headers_node_1.Headers(headers);
}
