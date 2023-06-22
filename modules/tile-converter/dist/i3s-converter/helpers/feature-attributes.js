"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPopupInfo = exports.createFieldAttribute = exports.getFieldAttributeType = exports.createdStorageAttribute = exports.getAttributeType = exports.checkPropertiesLength = exports.flattenPropertyTableByFeatureIds = void 0;
/**
 * Takes attributes from property table based on featureIds.
 * If there is no property value for particular featureId (index) the property will be null.
 * Example:
 * Initial data:
 *   OBJECTID: [0, 1, 5]
 *   component: ['Windows', 'Frames', 'Wall', 'Roof', 'Skylight']
 * Result:
 *   OBJECTID: [0, 1, 5]
 *   component: ['Windows', 'Frames', 'null']
 * @param featureIds
 * @param propertyTable
 */
function flattenPropertyTableByFeatureIds(featureIds, propertyTable) {
    const resultPropertyTable = {};
    for (const propertyName in propertyTable) {
        const properties = propertyTable[propertyName];
        resultPropertyTable[propertyName] = getPropertiesByFeatureIds(properties, featureIds);
    }
    return resultPropertyTable;
}
exports.flattenPropertyTableByFeatureIds = flattenPropertyTableByFeatureIds;
/**
 * Getting properties by featureId index
 * @param properties
 * @param featureIds
 */
function getPropertiesByFeatureIds(properties, featureIds) {
    const resultProperties = [];
    for (const featureId of featureIds) {
        const property = properties[featureId] || null;
        resultProperties.push(property);
    }
    return resultProperties;
}
/**
 * Check that all attributes in propertyTable have the same length as FeatureIds.
 * If there are differencies between lengths we should flatten property table based on exiesting featureIds.
 * @param featureIds
 * @param propertyTable
 * @returns
 */
function checkPropertiesLength(featureIds, propertyTable) {
    let needFlatten = false;
    for (const attribute of Object.values(propertyTable)) {
        if (featureIds.length !== attribute.length) {
            needFlatten = true;
        }
    }
    return needFlatten;
}
exports.checkPropertiesLength = checkPropertiesLength;
/** String data type name for feature attributes */
const STRING_TYPE = 'string';
/** Integer data type name for feature attributes */
const SHORT_INT_TYPE = 'Int32';
/** Double data type name for feature attributes */
const DOUBLE_TYPE = 'double';
/** Type of attribute that is linked with feature ids */
const OBJECT_ID_TYPE = 'OBJECTID';
/**
 * Get the attribute type for attributeStorageInfo https://github.com/Esri/i3s-spec/blob/master/docs/1.7/attributeStorageInfo.cmn.md
 * @param key - attribute's key
 * @param attribute - attribute's type in propertyTable
 */
function getAttributeType(key, attribute) {
    if (key === OBJECT_ID_TYPE) {
        return OBJECT_ID_TYPE;
    }
    if (typeof attribute === STRING_TYPE) {
        return STRING_TYPE;
    }
    else if (typeof attribute === 'number') {
        return Number.isInteger(attribute) ? SHORT_INT_TYPE : DOUBLE_TYPE;
    }
    return STRING_TYPE;
}
exports.getAttributeType = getAttributeType;
/**
 * Generate storage attribute for map segmentation.
 * @param attributeIndex - order index of attribute (f_0, f_1 ...).
 * @param key - attribute key from propertyTable.
 * @param attributeType - attribute type.
 * @return Updated storageAttribute.
 */
function createdStorageAttribute(attributeIndex, key, attributeType) {
    const storageAttribute = {
        key: `f_${attributeIndex}`,
        name: key,
        ordering: ['attributeValues'],
        header: [{ property: 'count', valueType: 'UInt32' }],
        attributeValues: { valueType: 'Int32', valuesPerElement: 1 }
    };
    switch (attributeType) {
        case OBJECT_ID_TYPE:
            setupIdAttribute(storageAttribute);
            break;
        case STRING_TYPE:
            setupStringAttribute(storageAttribute);
            break;
        case DOUBLE_TYPE:
            setupDoubleAttribute(storageAttribute);
            break;
        case SHORT_INT_TYPE:
            break;
        default:
            setupStringAttribute(storageAttribute);
    }
    return storageAttribute;
}
exports.createdStorageAttribute = createdStorageAttribute;
/**
 * Find and return attribute type based on key form propertyTable.
 * @param attributeType
 */
function getFieldAttributeType(attributeType) {
    switch (attributeType) {
        case OBJECT_ID_TYPE:
            return 'esriFieldTypeOID';
        case STRING_TYPE:
            return 'esriFieldTypeString';
        case SHORT_INT_TYPE:
            return 'esriFieldTypeInteger';
        case DOUBLE_TYPE:
            return 'esriFieldTypeDouble';
        default:
            return 'esriFieldTypeString';
    }
}
exports.getFieldAttributeType = getFieldAttributeType;
/**
 * Setup field attribute for map segmentation.
 * @param key - attribute for map segmentation.
 * @param fieldAttributeType - esri attribute type ('esriFieldTypeString' or 'esriFieldTypeOID').
 */
function createFieldAttribute(key, fieldAttributeType) {
    return {
        name: key,
        type: fieldAttributeType,
        alias: key
    };
}
exports.createFieldAttribute = createFieldAttribute;
/**
 * Generate popup info to show metadata on the map.
 * @param propertyTable - table data with OBJECTID.
 * @return data for correct rendering of popup.
 */
function createPopupInfo(propertyTable) {
    const title = '{OBJECTID}';
    const mediaInfos = [];
    const fieldInfos = [];
    const popupElements = [];
    const expressionInfos = [];
    for (const key in propertyTable) {
        fieldInfos.push({
            fieldName: key,
            visible: true,
            isEditable: false,
            label: key
        });
    }
    popupElements.push({
        fieldInfos,
        type: 'fields'
    });
    return {
        title,
        mediaInfos,
        popupElements,
        fieldInfos,
        expressionInfos
    };
}
exports.createPopupInfo = createPopupInfo;
/**
 * Setup storage attribute as string.
 * @param storageAttribute - attribute for map segmentation.
 */
function setupStringAttribute(storageAttribute) {
    // @ts-expect-error
    storageAttribute.ordering.unshift('attributeByteCounts');
    storageAttribute.header.push({ property: 'attributeValuesByteCount', valueType: 'UInt32' });
    storageAttribute.attributeValues = {
        valueType: 'String',
        encoding: 'UTF-8',
        valuesPerElement: 1
    };
    storageAttribute.attributeByteCounts = {
        valueType: 'UInt32',
        valuesPerElement: 1
    };
}
/**
 * Setup Id attribute for map segmentation.
 * @param storageAttribute - attribute for map segmentation .
 */
function setupIdAttribute(storageAttribute) {
    storageAttribute.attributeValues = {
        valueType: 'Oid32',
        valuesPerElement: 1
    };
}
/**
 * Setup double attribute for map segmentation.
 * @param storageAttribute - attribute for map segmentation .
 */
function setupDoubleAttribute(storageAttribute) {
    storageAttribute.attributeValues = {
        valueType: 'Float64',
        valuesPerElement: 1
    };
}
