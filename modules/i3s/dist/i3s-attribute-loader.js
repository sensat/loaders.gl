"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributeValueType = exports.loadFeatureAttributes = exports.I3SAttributeLoader = void 0;
const core_1 = require("@loaders.gl/core");
const parse_i3s_attribute_1 = require("./lib/parsers/parse-i3s-attribute");
const url_utils_1 = require("./lib/utils/url-utils");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const EMPTY_VALUE = '';
const REJECTED_STATUS = 'rejected';
/**
 * Loader for I3S attributes
 */
exports.I3SAttributeLoader = {
    name: 'I3S Attribute',
    id: 'i3s-attribute',
    module: 'i3s',
    version: VERSION,
    mimeTypes: ['application/binary'],
    parse: async (arrayBuffer, options) => (0, parse_i3s_attribute_1.parseI3STileAttribute)(arrayBuffer, options),
    extensions: ['bin'],
    options: {},
    binary: true
};
// TODO - these seem to use the loader rather than being part of the loader. Move to different file...
/**
 * Load attributes based on feature id
 * @param {Object} tile
 * @param {number} featureId
 * @param {Object} options
 * @returns {Promise}
 */
// eslint-disable-next-line complexity
async function loadFeatureAttributes(tile, featureId, options = {}) {
    const { attributeStorageInfo, attributeUrls, tilesetFields } = getAttributesData(tile);
    if (!attributeStorageInfo || !attributeUrls || featureId < 0) {
        return null;
    }
    let attributes = [];
    const attributeLoadPromises = [];
    for (let index = 0; index < attributeStorageInfo.length; index++) {
        // @ts-ignore
        const url = (0, url_utils_1.getUrlWithToken)(attributeUrls[index], options.i3s?.token);
        const attributeName = attributeStorageInfo[index].name;
        const attributeType = getAttributeValueType(attributeStorageInfo[index]);
        const loadOptions = { ...options, attributeName, attributeType };
        const promise = (0, core_1.load)(url, exports.I3SAttributeLoader, loadOptions);
        attributeLoadPromises.push(promise);
    }
    try {
        attributes = await Promise.allSettled(attributeLoadPromises);
    }
    catch (error) {
        // do nothing
    }
    if (!attributes.length) {
        return null;
    }
    return generateAttributesByFeatureId(attributes, attributeStorageInfo, featureId, tilesetFields);
}
exports.loadFeatureAttributes = loadFeatureAttributes;
/**
 * Gets attributes data from tile.
 * @param tile
 * @returns
 */
function getAttributesData(tile) {
    const attributeStorageInfo = tile.tileset?.tileset?.attributeStorageInfo;
    const attributeUrls = tile.header?.attributeUrls;
    const tilesetFields = tile.tileset?.tileset?.fields || [];
    return { attributeStorageInfo, attributeUrls, tilesetFields };
}
/**
 * Get attribute value type based on property names
 * @param {Object} attribute
 * @returns {String}
 */
function getAttributeValueType(attribute) {
    if (attribute.hasOwnProperty('objectIds')) {
        return 'Oid32';
    }
    else if (attribute.hasOwnProperty('attributeValues')) {
        return attribute.attributeValues.valueType;
    }
    return '';
}
exports.getAttributeValueType = getAttributeValueType;
/**
 * Find in attributeStorageInfo attribute name responsible for feature ids list.
 * @param attributeStorageInfo
 * @returns Feature ids attribute name
 */
function getFeatureIdsAttributeName(attributeStorageInfo) {
    const objectIdsAttribute = attributeStorageInfo.find(attribute => attribute.name.includes('OBJECTID'));
    return objectIdsAttribute?.name;
}
/**
 * Generates mapping featureId to feature attributes
 * @param {Array} attributes
 * @param {Object} attributeStorageInfo
 * @param {number} featureId
 * @returns {Object}
 */
function generateAttributesByFeatureId(attributes, attributeStorageInfo, featureId, tilesetFields) {
    const objectIdsAttributeName = getFeatureIdsAttributeName(attributeStorageInfo);
    const objectIds = attributes.find((attribute) => attribute.value[objectIdsAttributeName]);
    if (!objectIds) {
        return null;
    }
    const attributeIndex = objectIds.value[objectIdsAttributeName].indexOf(featureId);
    if (attributeIndex < 0) {
        return null;
    }
    return getFeatureAttributesByIndex(attributes, attributeIndex, attributeStorageInfo, tilesetFields);
}
/**
 * Generates attribute object for feature mapping by feature id
 * @param {Array} attributes
 * @param {Number} featureIdIndex
 * @param {Object} attributeStorageInfo
 * @returns {Object}
 */
function getFeatureAttributesByIndex(attributes, featureIdIndex, attributeStorageInfo, tilesetFields) {
    const attributesObject = {};
    for (let index = 0; index < attributeStorageInfo.length; index++) {
        const attributeName = attributeStorageInfo[index].name;
        const codedValues = getAttributeCodedValues(attributeName, tilesetFields);
        const attribute = getAttributeByIndexAndAttributeName(attributes, index, attributeName);
        attributesObject[attributeName] = formatAttributeValue(attribute, featureIdIndex, codedValues);
    }
    return attributesObject;
}
/**
 * Get coded values list from tileset.
 * @param attributeName
 * @param tilesetFields
 */
function getAttributeCodedValues(attributeName, tilesetFields) {
    const attributeField = tilesetFields
        .find(field => field.name === attributeName || field.alias === attributeName);
    return attributeField?.domain?.codedValues || [];
}
/**
 * Return attribute value if it presents in atrributes list
 * @param {array} attributes
 * @param {number} index
 * @param {string} attributesName
 */
function getAttributeByIndexAndAttributeName(attributes, index, attributesName) {
    const attributeObject = attributes[index];
    if (attributeObject.status === REJECTED_STATUS) {
        return null;
    }
    return attributeObject.value[attributesName];
}
/**
 * Do formatting of attribute values or return empty string.
 * @param {Array} attribute
 * @param {Number} featureIdIndex
 * @returns {String}
 */
function formatAttributeValue(attribute, featureIdIndex, codedValues) {
    let value = EMPTY_VALUE;
    if (attribute && (featureIdIndex in attribute)) {
        // eslint-disable-next-line no-control-regex
        value = String(attribute[featureIdIndex]).replace(/\u0000|NaN/g, '').trim();
    }
    // Check if coded values are existed. If so we use them.
    if (codedValues.length) {
        const codeValue = codedValues.find(codedValue => codedValue.code === Number(value));
        value = codeValue?.name || EMPTY_VALUE;
    }
    return value;
}
