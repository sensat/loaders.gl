import type { FeatureTableJson } from '@loaders.gl/3d-tiles';
import { Attribute, AttributeStorageInfo, ESRIField, Field, PopupInfo } from '@loaders.gl/i3s';
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
export declare function flattenPropertyTableByFeatureIds(featureIds: number[], propertyTable: FeatureTableJson): FeatureTableJson;
/**
 * Check that all attributes in propertyTable have the same length as FeatureIds.
 * If there are differencies between lengths we should flatten property table based on exiesting featureIds.
 * @param featureIds
 * @param propertyTable
 * @returns
 */
export declare function checkPropertiesLength(featureIds: number[], propertyTable: FeatureTableJson): boolean;
/**
 * Get the attribute type for attributeStorageInfo https://github.com/Esri/i3s-spec/blob/master/docs/1.7/attributeStorageInfo.cmn.md
 * @param key - attribute's key
 * @param attribute - attribute's type in propertyTable
 */
export declare function getAttributeType(key: string, attribute: string): string;
/**
 * Generate storage attribute for map segmentation.
 * @param attributeIndex - order index of attribute (f_0, f_1 ...).
 * @param key - attribute key from propertyTable.
 * @param attributeType - attribute type.
 * @return Updated storageAttribute.
 */
export declare function createdStorageAttribute(attributeIndex: number, key: string, attributeType: Attribute): AttributeStorageInfo;
/**
 * Find and return attribute type based on key form propertyTable.
 * @param attributeType
 */
export declare function getFieldAttributeType(attributeType: Attribute): ESRIField;
/**
 * Setup field attribute for map segmentation.
 * @param key - attribute for map segmentation.
 * @param fieldAttributeType - esri attribute type ('esriFieldTypeString' or 'esriFieldTypeOID').
 */
export declare function createFieldAttribute(key: string, fieldAttributeType: ESRIField): Field;
/**
 * Generate popup info to show metadata on the map.
 * @param propertyTable - table data with OBJECTID.
 * @return data for correct rendering of popup.
 */
export declare function createPopupInfo(propertyTable: FeatureTableJson): PopupInfo;
//# sourceMappingURL=feature-attributes.d.ts.map