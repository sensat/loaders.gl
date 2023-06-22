import { getDataTypeFromArray } from '@loaders.gl/schema';
export function getOBJSchema(attributes) {
  let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
  return {
    fields,
    metadata: stringMetadata
  };
}
function getFieldFromAttribute(name, attribute) {
  const metadata = {};
  for (const key in attribute) {
    if (key !== 'value') {
      metadata[key] = JSON.stringify(attribute[key]);
    }
  }
  let {
    type
  } = getDataTypeFromArray(attribute.value);
  const isSingleValue = attribute.size === 1 || attribute.size === undefined;
  if (!isSingleValue) {
    type = {
      type: 'fixed-size-list',
      listSize: attribute.size,
      children: [{
        name: 'values',
        type
      }]
    };
  }
  return {
    name,
    type,
    nullable: false,
    metadata
  };
}
//# sourceMappingURL=get-obj-schema.js.map