"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customizeColors = void 0;
const core_1 = require("@loaders.gl/core");
const i3s_attribute_loader_1 = require("../../i3s-attribute-loader");
const url_utils_1 = require("../utils/url-utils");
/**
 * Modify vertex colors array to visualize 3D objects in a attribute driven way
 * @param colors - vertex colors attribute
 * @param featureIds - feature Ids attribute
 * @param tileOptions - tile - related options
 * @param tilesetOptions - tileset-related options
 * @param options - loader options
 * @returns midified colors attribute
 */
async function customizeColors(colors, featureIds, tileOptions, tilesetOptions, options) {
    if (!options?.i3s?.colorsByAttribute) {
        return colors;
    }
    const colorizeAttributeField = tilesetOptions.fields.find(({ name }) => name === options?.i3s?.colorsByAttribute?.attributeName);
    if (!colorizeAttributeField ||
        !['esriFieldTypeDouble', 'esriFieldTypeInteger', 'esriFieldTypeSmallInteger'].includes(colorizeAttributeField.type)) {
        return colors;
    }
    const colorizeAttributeData = await loadFeatureAttributeData(colorizeAttributeField.name, tileOptions, tilesetOptions, options);
    if (!colorizeAttributeData) {
        return colors;
    }
    const objectIdField = tilesetOptions.fields.find(({ type }) => type === 'esriFieldTypeOID');
    if (!objectIdField) {
        return colors;
    }
    const objectIdAttributeData = await loadFeatureAttributeData(objectIdField.name, tileOptions, tilesetOptions, options);
    if (!objectIdAttributeData) {
        return colors;
    }
    const attributeValuesMap = {};
    // @ts-expect-error
    for (let i = 0; i < objectIdAttributeData[objectIdField.name].length; i++) {
        // @ts-expect-error
        attributeValuesMap[objectIdAttributeData[objectIdField.name][i]] = calculateColorForAttribute(
        // @ts-expect-error
        colorizeAttributeData[colorizeAttributeField.name][i], options);
    }
    for (let i = 0; i < featureIds.value.length; i++) {
        const color = attributeValuesMap[featureIds.value[i]];
        if (!color) {
            continue; // eslint-disable-line no-continue
        }
        colors.value.set(color, i * 4);
    }
    return colors;
}
exports.customizeColors = customizeColors;
/**
 * Calculate rgba color from the attribute value
 * @param attributeValue - value of the attribute
 * @param options - loader options
 * @returns - color array for a specific attribute value
 */
function calculateColorForAttribute(attributeValue, options) {
    if (!options?.i3s?.colorsByAttribute) {
        return [255, 255, 255, 255];
    }
    const { minValue, maxValue, minColor, maxColor } = options.i3s.colorsByAttribute;
    const rate = (attributeValue - minValue) / (maxValue - minValue);
    const color = [255, 255, 255, 255];
    for (let i = 0; i < minColor.length; i++) {
        color[i] = Math.round((maxColor[i] - minColor[i]) * rate + minColor[i]);
    }
    return color;
}
/**
 * Load feature attribute data from the ArcGIS rest service
 * @param attributeName - attribute name
 * @param tileOptions - tile-related options
 * @param tilesetOptions - tileset-related options
 * @param options - loader options
 * @returns - Array-like list of the attribute values
 */
async function loadFeatureAttributeData(attributeName, { attributeUrls }, { attributeStorageInfo }, options) {
    const attributeIndex = attributeStorageInfo.findIndex(({ name }) => attributeName === name);
    if (attributeIndex === -1) {
        return null;
    }
    const objectIdAttributeUrl = (0, url_utils_1.getUrlWithToken)(attributeUrls[attributeIndex], options?.i3s?.token);
    const attributeType = (0, i3s_attribute_loader_1.getAttributeValueType)(attributeStorageInfo[attributeIndex]);
    const objectIdAttributeData = await (0, core_1.load)(objectIdAttributeUrl, i3s_attribute_loader_1.I3SAttributeLoader, {
        attributeName,
        attributeType
    });
    // @ts-expect-error TODO action engine
    return objectIdAttributeData;
}
