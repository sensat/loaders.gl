"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMeshAttributeMetadata = exports.deduceMeshField = exports.deduceMeshSchema = void 0;
const data_type_1 = require("../table/simple-table/data-type");
/**
 * Create a schema for mesh attributes data
 * @param attributes
 * @param metadata
 * @returns
 */
function deduceMeshSchema(attributes, metadata = {}) {
    const fields = deduceMeshFields(attributes);
    return { fields, metadata };
}
exports.deduceMeshSchema = deduceMeshSchema;
/**
 * Create arrow-like schema field for mesh attribute
 * @param attributeName
 * @param attribute
 * @param optionalMetadata
 * @returns
 */
function deduceMeshField(name, attribute, optionalMetadata) {
    const type = (0, data_type_1.getDataTypeFromTypedArray)(attribute.value);
    const metadata = optionalMetadata ? optionalMetadata : makeMeshAttributeMetadata(attribute);
    return {
        name,
        type: { type: 'fixed-size-list', listSize: attribute.size, children: [{ name: 'value', type }] },
        nullable: false,
        metadata
    };
}
exports.deduceMeshField = deduceMeshField;
/**
 * Create fields array for mesh attributes
 * @param attributes
 * @returns
 */
function deduceMeshFields(attributes) {
    const fields = [];
    for (const attributeName in attributes) {
        const attribute = attributes[attributeName];
        fields.push(deduceMeshField(attributeName, attribute));
    }
    return fields;
}
/**
 * Make metadata by mesh attribute properties
 * @param attribute
 * @returns
 */
function makeMeshAttributeMetadata(attribute) {
    const result = {};
    if ('byteOffset' in attribute) {
        result.byteOffset = attribute.byteOffset.toString(10);
    }
    if ('byteStride' in attribute) {
        result.byteStride = attribute.byteStride.toString(10);
    }
    if ('normalized' in attribute) {
        result.normalized = attribute.normalized.toString();
    }
    return result;
}
exports.makeMeshAttributeMetadata = makeMeshAttributeMetadata;
