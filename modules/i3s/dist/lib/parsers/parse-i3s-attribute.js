"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseI3STileAttribute = void 0;
const constants_1 = require("./constants");
/**
 * Get particular tile and creates attribute object inside.
 * @param  arrayBuffer
 * @param {Object} options
 * @returns {Promise<object>}
 */
function parseI3STileAttribute(arrayBuffer, options) {
    const { attributeName, attributeType } = options;
    if (!attributeName) {
        return {};
    }
    return {
        [attributeName]: attributeType ? parseAttribute(attributeType, arrayBuffer) : null
    };
}
exports.parseI3STileAttribute = parseI3STileAttribute;
/**
 * Parse attributes based on attribute type.
 * @param {String} attributeType
 * @param  arrayBuffer
 * @returns
 */
function parseAttribute(attributeType, arrayBuffer) {
    switch (attributeType) {
        case constants_1.STRING_ATTRIBUTE_TYPE:
            return parseStringsAttribute(arrayBuffer);
        case constants_1.OBJECT_ID_ATTRIBUTE_TYPE:
            return parseShortNumberAttribute(arrayBuffer);
        case constants_1.FLOAT_64_TYPE:
            return parseFloatAttribute(arrayBuffer);
        case constants_1.INT_16_ATTRIBUTE_TYPE:
            return parseInt16ShortNumberAttribute(arrayBuffer);
        default:
            return parseShortNumberAttribute(arrayBuffer);
    }
}
/**
 * Parse short number attribute.
 * Short Integer spec - https://github.com/Esri/i3s-spec/blob/master/docs/1.7/attributeStorageInfo.cmn.md
 * @param  arrayBuffer
 * @returns
 */
function parseShortNumberAttribute(arrayBuffer) {
    const countOffset = 4;
    return new Uint32Array(arrayBuffer, countOffset);
}
/**
 * Parse Int16 short number attribute.
 * Parsing of such data is not documented. Added to handle Building Scene Layer Tileset attributes data.
 * @param  arrayBuffer
 * @returns
 */
function parseInt16ShortNumberAttribute(arrayBuffer) {
    const countOffset = 4;
    return new Int16Array(arrayBuffer, countOffset);
}
/**
 * Parse float attribute.
 * Double Spec - https://github.com/Esri/i3s-spec/blob/master/docs/1.7/attributeStorageInfo.cmn.md
 * @param  arrayBuffer
 * @returns
 */
function parseFloatAttribute(arrayBuffer) {
    const countOffset = 8;
    return new Float64Array(arrayBuffer, countOffset);
}
/**
 * Parse string attribute.
 * String spec - https://github.com/Esri/i3s-spec/blob/master/docs/1.7/attributeStorageInfo.cmn.md
 * @param arrayBuffer
 * @returns list of strings
 */
function parseStringsAttribute(arrayBuffer) {
    const stringsCountOffset = 0;
    const dataOffset = 8;
    const bytesPerStringSize = 4;
    const stringsArray = [];
    try {
        // Use DataView to avoid multiple of 4 error on Uint32Array constructor
        const stringsCount = new DataView(arrayBuffer, stringsCountOffset, bytesPerStringSize).getUint32(stringsCountOffset, true);
        const stringSizes = new Uint32Array(arrayBuffer, dataOffset, stringsCount);
        let stringOffset = dataOffset + stringsCount * bytesPerStringSize;
        for (const stringByteSize of stringSizes) {
            const textDecoder = new TextDecoder('utf-8');
            const stringAttribute = new Uint8Array(arrayBuffer, stringOffset, stringByteSize);
            stringsArray.push(textDecoder.decode(stringAttribute));
            stringOffset += stringByteSize;
        }
    }
    catch (error) {
        console.error('Parse string attribute error: ', error.message); // eslint-disable-line
    }
    return stringsArray;
}
