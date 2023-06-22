import fs from 'fs';
import { Response } from './response.node';
import { Headers } from './headers.node';
export function isRequestURL(url) {
  return url.startsWith('http:') || url.startsWith('https:');
}
export async function fetchFileNode(url, options) {
  const noqueryUrl = url.split('?')[0];
  try {
    const body = await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(noqueryUrl, {
        encoding: null
      });
      stream.once('readable', () => resolve(stream));
      stream.on('error', error => reject(error));
    });
    const status = 200;
    const statusText = 'OK';
    const headers = getHeadersForFile(noqueryUrl);
    return new Response(body, {
      headers,
      status,
      statusText,
      url
    });
  } catch (error) {
    const status = 400;
    const statusText = error.message;
    const headers = {};
    return new Response(error.message, {
      headers,
      status,
      statusText,
      url
    });
  }
}
function getHeadersForFile(noqueryUrl) {
  const headers = {};
  if (!headers['content-length']) {
    const stats = fs.statSync(noqueryUrl);
    headers['content-length'] = stats.size;
  }
  if (noqueryUrl.endsWith('.gz')) {
    noqueryUrl = noqueryUrl.slice(0, -3);
    headers['content-encoding'] = 'gzip';
  }
  return new Headers(headers);
}
//# sourceMappingURL=fetch-file.node.js.map