"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDracoSchema = void 0;
const schema_1 = require("@loaders.gl/schema");
/** Extract an arrow-like schema from a Draco mesh */
function getDracoSchema(attributes, loaderData, indices) {
    const metadata = makeMetadata(loaderData.metadata);
    const fields = [];
    const namedLoaderDataAttributes = transformAttributesLoaderData(loaderData.attributes);
    for (const attributeName in attributes) {
        const attribute = attributes[attributeName];
        const field = getArrowFieldFromAttribute(attributeName, attribute, namedLoaderDataAttributes[attributeName]);
        fields.push(field);
    }
    if (indices) {
        const indicesField = getArrowFieldFromAttribute('indices', indices);
        fields.push(indicesField);
    }
    return { fields, metadata };
}
exports.getDracoSchema = getDracoSchema;
function transformAttributesLoaderData(loaderData) {
    const result = {};
    for (const key in loaderData) {
        const dracoAttribute = loaderData[key];
        result[dracoAttribute.name || 'undefined'] = dracoAttribute;
    }
    return result;
}
function getArrowFieldFromAttribute(attributeName, attribute, loaderData) {
    const metadataMap = loaderData ? makeMetadata(loaderData.metadata) : undefined;
    const field = (0, schema_1.deduceMeshField)(attributeName, attribute, metadataMap);
    return field;
}
function makeMetadata(metadata) {
    Object.entries(metadata);
    const serializedMetadata = {};
    for (const key in metadata) {
        serializedMetadata[`${key}.string`] = JSON.stringify(metadata[key]);
    }
    return serializedMetadata;
}
