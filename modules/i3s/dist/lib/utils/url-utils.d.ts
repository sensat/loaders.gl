import { Node3DIndexDocument } from '../../types';
/**
 * Generates url with token if it is exists.
 * @param url
 * @param token
 * @returns
 */
export declare function getUrlWithToken(url: string, token?: string | null): string;
/**
 * Generates attribute urls for tile.
 * @param tile
 * @returns list of attribute urls
 */
export declare function generateTileAttributeUrls(url: string, tile: Node3DIndexDocument): string[];
/**
 * Generates attribute urls for tileset based on tileset and resource
 * @param {Object} tileset
 * @param {number} resource
 * @returns {Array}
 */
export declare function generateTilesetAttributeUrls(tileset: any, resource: any): string[];
//# sourceMappingURL=url-utils.d.ts.map