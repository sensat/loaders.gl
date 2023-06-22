"use strict";
// loaders.gl, MIT license
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTTPRequestReadStream = exports.fetchNode = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const response_node_1 = require("./response.node");
const headers_node_1 = require("./headers.node");
const decode_data_uri_node_1 = require("./utils/decode-data-uri.node");
const fetch_file_node_1 = require("./fetch-file.node");
const isDataURL = (url) => url.startsWith('data:');
const isRequestURL = (url) => url.startsWith('http:') || url.startsWith('https:');
/**
 * Emulation of Browser fetch for Node.js
 * @param url
 * @param options
 */
// eslint-disable-next-line complexity
async function fetchNode(url, options) {
    try {
        // Handle file streams in node
        if (!isRequestURL(url) && !isDataURL(url)) {
            return await (0, fetch_file_node_1.fetchFileNode)(url, options);
        }
        // Handle data urls in node, to match `fetch``
        // Note - this loses the MIME type, data URIs are handled directly in fetch
        if (isDataURL(url)) {
            const { arrayBuffer, mimeType } = (0, decode_data_uri_node_1.decodeDataUri)(url);
            const response = new response_node_1.Response(arrayBuffer, {
                headers: { 'content-type': mimeType },
                url
            });
            return response;
        }
        // Automatically decompress gzipped files with .gz extension
        const syntheticResponseHeaders = {};
        const originalUrl = url;
        if (url.endsWith('.gz')) {
            url = url.slice(0, -3);
            syntheticResponseHeaders['content-encoding'] = 'gzip';
        }
        // Need to create the stream in advance since Response constructor needs to be sync
        const body = await createHTTPRequestReadStream(originalUrl, options);
        const headers = getHeaders(url, body, syntheticResponseHeaders);
        const { status, statusText } = getStatus(body);
        const followRedirect = !options || options.followRedirect || options.followRedirect === undefined;
        if (status >= 300 && status < 400 && headers.has('location') && followRedirect) {
            const redirectUrl = generateRedirectUrl(url, headers.get('location'));
            // Redirect
            return await fetchNode(redirectUrl, options);
        }
        return new response_node_1.Response(body, { headers, status, statusText, url });
    }
    catch (error) {
        // TODO - what error code to use here?
        return new response_node_1.Response(null, { status: 400, statusText: String(error), url });
    }
}
exports.fetchNode = fetchNode;
/** Returns a promise that resolves to a readable stream */
async function createHTTPRequestReadStream(url, options) {
    // HANDLE HTTP/HTTPS REQUESTS IN NODE
    // TODO: THIS IS BAD SINCE WE RETURN A PROMISE INSTEAD OF A STREAM
    return await new Promise((resolve, reject) => {
        const requestOptions = getRequestOptions(url, options);
        const req = url.startsWith('https:')
            ? https_1.default.request(requestOptions, (res) => resolve(res))
            : http_1.default.request(requestOptions, (res) => resolve(res));
        req.on('error', (error) => reject(error));
        req.end();
    });
}
exports.createHTTPRequestReadStream = createHTTPRequestReadStream;
/**
 * Generate redirect url from location without origin and protocol.
 * @param originalUrl
 * @param redirectUrl
 */
function generateRedirectUrl(originalUrl, location) {
    if (location.startsWith('http')) {
        return location;
    }
    // If url doesn't have origin and protocol just extend current url origin with location.
    const url = new URL(originalUrl);
    url.pathname = location;
    return url.href;
}
// HELPER FUNCTIONS
function getRequestOptions(url, options) {
    // Ensure header keys are lower case so that we can merge without duplicates
    const originalHeaders = options?.headers || {};
    const headers = {};
    for (const key of Object.keys(originalHeaders)) {
        headers[key.toLowerCase()] = originalHeaders[key];
    }
    // Add default accept-encoding to headers
    headers['accept-encoding'] = headers['accept-encoding'] || 'gzip,br,deflate';
    const urlObject = new URL(url);
    return {
        hostname: urlObject.hostname,
        path: urlObject.pathname,
        method: 'GET',
        // Add options and user provided 'options.fetch' overrides if available
        ...options,
        ...options?.fetch,
        // Override with updated headers with accepted encodings:
        headers,
        port: urlObject.port
    };
}
function getStatus(httpResponse) {
    if (httpResponse.statusCode) {
        return { status: httpResponse.statusCode, statusText: httpResponse.statusMessage || 'NA' };
    }
    return { status: 200, statusText: 'OK' };
}
function getHeaders(url, httpResponse, additionalHeaders = {}) {
    const headers = {};
    if (httpResponse && httpResponse.headers) {
        const httpHeaders = httpResponse.headers;
        for (const key in httpHeaders) {
            const header = httpHeaders[key];
            headers[key.toLowerCase()] = String(header);
        }
    }
    // Fix up content length if we can for best progress experience
    if (!headers['content-length']) {
        const contentLength = getContentLength(url);
        if (Number.isFinite(contentLength)) {
            headers['content-length'] = contentLength;
        }
    }
    Object.assign(headers, additionalHeaders);
    return new headers_node_1.Headers(headers);
}
/** Needs to be read from actual headers */
function getContentLength(url) {
    // TODO - remove media type etc
    return isDataURL(url) ? url.length - 'data:'.length : null;
}
