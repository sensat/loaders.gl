/// <reference types="node" />
import http from 'http';
import { Response } from './response.node';
/**
 * Emulation of Browser fetch for Node.js
 * @param url
 * @param options
 */
export declare function fetchNode(url: string, options: any): Promise<Response>;
/** Returns a promise that resolves to a readable stream */
export declare function createHTTPRequestReadStream(url: string, options: any): Promise<http.IncomingMessage>;
//# sourceMappingURL=fetch.node.d.ts.map