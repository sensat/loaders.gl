"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOBJSchema = void 0;
const schema_1 = require("@loaders.gl/schema");
/** Get Mesh Schema */
function getOBJSchema(attributes, metadata = {}) {
    const stringMetadata = {};
    for (const key in metadata) {
        if (key !== 'value') {
            stringMetadata[key] = JSON.stringify(metadata[key]);
        }
    }
    const fields = [];
    for (const attributeName in attributes) {
        const attribute = attributes[attributeName];
        const field = getFieldFromAttribute(attributeName, attribute);
        fields.push(field);
    }
    return { fields, metadata: stringMetadata };
}
exports.getOBJSchema = getOBJSchema;
/** Get a Field describing the column from an OBJ attribute */
function getFieldFromAttribute(name, attribute) {
    const metadata = {};
    for (const key in attribute) {
        if (key !== 'value') {
            metadata[key] = JSON.stringify(attribute[key]);
        }
    }
    let { type } = (0, schema_1.getDataTypeFromArray)(attribute.value);
    const isSingleValue = attribute.size === 1 || attribute.size === undefined;
    if (!isSingleValue) {
        type = { type: 'fixed-size-list', listSize: attribute.size, children: [{ name: 'values', type }] };
    }
    return { name, type, nullable: false, metadata };
}
