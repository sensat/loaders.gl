"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTilesetAttributeUrls = exports.generateTileAttributeUrls = exports.getUrlWithToken = void 0;
/**
 * Generates url with token if it is exists.
 * @param url
 * @param token
 * @returns
 */
function getUrlWithToken(url, token = null) {
    return token ? `${url}?token=${token}` : url;
}
exports.getUrlWithToken = getUrlWithToken;
/**
 * Generates attribute urls for tile.
 * @param tile
 * @returns list of attribute urls
 */
function generateTileAttributeUrls(url, tile) {
    const { attributeData = [] } = tile;
    const attributeUrls = [];
    for (let index = 0; index < attributeData.length; index++) {
        const attributeUrl = attributeData[index].href.replace('./', '');
        attributeUrls.push(`${url}/${attributeUrl}`);
    }
    return attributeUrls;
}
exports.generateTileAttributeUrls = generateTileAttributeUrls;
/**
 * Generates attribute urls for tileset based on tileset and resource
 * @param {Object} tileset
 * @param {number} resource
 * @returns {Array}
 */
function generateTilesetAttributeUrls(tileset, resource) {
    const attributeUrls = [];
    const { attributeStorageInfo, url } = tileset;
    for (let index = 0; index < attributeStorageInfo.length; index++) {
        const fileName = attributeStorageInfo[index].key;
        attributeUrls.push(`${url}/nodes/${resource}/attributes/${fileName}/0`);
    }
    return attributeUrls;
}
exports.generateTilesetAttributeUrls = generateTilesetAttributeUrls;
