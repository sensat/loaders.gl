import { getDataTypeFromTypedArray } from '../table/simple-table/data-type';
export function deduceMeshSchema(attributes) {
  let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const fields = deduceMeshFields(attributes);
  return {
    fields,
    metadata
  };
}
export function deduceMeshField(name, attribute, optionalMetadata) {
  const type = getDataTypeFromTypedArray(attribute.value);
  const metadata = optionalMetadata ? optionalMetadata : makeMeshAttributeMetadata(attribute);
  return {
    name,
    type: {
      type: 'fixed-size-list',
      listSize: attribute.size,
      children: [{
        name: 'value',
        type
      }]
    },
    nullable: false,
    metadata
  };
}
function deduceMeshFields(attributes) {
  const fields = [];
  for (const attributeName in attributes) {
    const attribute = attributes[attributeName];
    fields.push(deduceMeshField(attributeName, attribute));
  }
  return fields;
}
export function makeMeshAttributeMetadata(attribute) {
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
//# sourceMappingURL=deduce-mesh-schema.js.map