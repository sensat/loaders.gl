import http from 'http';
import https from 'https';
import { Response } from './response.node';
import { Headers } from './headers.node';
import { decodeDataUri } from './utils/decode-data-uri.node';
import { fetchFileNode } from './fetch-file.node';
const isDataURL = url => url.startsWith('data:');
const isRequestURL = url => url.startsWith('http:') || url.startsWith('https:');
export async function fetchNode(url, options) {
  try {
    if (!isRequestURL(url) && !isDataURL(url)) {
      return await fetchFileNode(url, options);
    }
    if (isDataURL(url)) {
      const {
        arrayBuffer,
        mimeType
      } = decodeDataUri(url);
      const response = new Response(arrayBuffer, {
        headers: {
          'content-type': mimeType
        },
        url
      });
      return response;
    }
    const syntheticResponseHeaders = {};
    const originalUrl = url;
    if (url.endsWith('.gz')) {
      url = url.slice(0, -3);
      syntheticResponseHeaders['content-encoding'] = 'gzip';
    }
    const body = await createHTTPRequestReadStream(originalUrl, options);
    const headers = getHeaders(url, body, syntheticResponseHeaders);
    const {
      status,
      statusText
    } = getStatus(body);
    const followRedirect = !options || options.followRedirect || options.followRedirect === undefined;
    if (status >= 300 && status < 400 && headers.has('location') && followRedirect) {
      const redirectUrl = generateRedirectUrl(url, headers.get('location'));
      return await fetchNode(redirectUrl, options);
    }
    return new Response(body, {
      headers,
      status,
      statusText,
      url
    });
  } catch (error) {
    return new Response(null, {
      status: 400,
      statusText: String(error),
      url
    });
  }
}
export async function createHTTPRequestReadStream(url, options) {
  return await new Promise((resolve, reject) => {
    const requestOptions = getRequestOptions(url, options);
    const req = url.startsWith('https:') ? https.request(requestOptions, res => resolve(res)) : http.request(requestOptions, res => resolve(res));
    req.on('error', error => reject(error));
    req.end();
  });
}
function generateRedirectUrl(originalUrl, location) {
  if (location.startsWith('http')) {
    return location;
  }
  const url = new URL(originalUrl);
  url.pathname = location;
  return url.href;
}
function getRequestOptions(url, options) {
  const originalHeaders = (options === null || options === void 0 ? void 0 : options.headers) || {};
  const headers = {};
  for (const key of Object.keys(originalHeaders)) {
    headers[key.toLowerCase()] = originalHeaders[key];
  }
  headers['accept-encoding'] = headers['accept-encoding'] || 'gzip,br,deflate';
  const urlObject = new URL(url);
  return {
    hostname: urlObject.hostname,
    path: urlObject.pathname,
    method: 'GET',
    ...options,
    ...(options === null || options === void 0 ? void 0 : options.fetch),
    headers,
    port: urlObject.port
  };
}
function getStatus(httpResponse) {
  if (httpResponse.statusCode) {
    return {
      status: httpResponse.statusCode,
      statusText: httpResponse.statusMessage || 'NA'
    };
  }
  return {
    status: 200,
    statusText: 'OK'
  };
}
function getHeaders(url, httpResponse) {
  let additionalHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const headers = {};
  if (httpResponse && httpResponse.headers) {
    const httpHeaders = httpResponse.headers;
    for (const key in httpHeaders) {
      const header = httpHeaders[key];
      headers[key.toLowerCase()] = String(header);
    }
  }
  if (!headers['content-length']) {
    const contentLength = getContentLength(url);
    if (Number.isFinite(contentLength)) {
      headers['content-length'] = contentLength;
    }
  }
  Object.assign(headers, additionalHeaders);
  return new Headers(headers);
}
function getContentLength(url) {
  return isDataURL(url) ? url.length - 'data:'.length : null;
}
//# sourceMappingURL=fetch.node.js.map