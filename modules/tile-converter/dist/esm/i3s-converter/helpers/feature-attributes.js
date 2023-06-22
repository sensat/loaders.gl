export function flattenPropertyTableByFeatureIds(featureIds, propertyTable) {
  const resultPropertyTable = {};
  for (const propertyName in propertyTable) {
    const properties = propertyTable[propertyName];
    resultPropertyTable[propertyName] = getPropertiesByFeatureIds(properties, featureIds);
  }
  return resultPropertyTable;
}
function getPropertiesByFeatureIds(properties, featureIds) {
  const resultProperties = [];
  for (const featureId of featureIds) {
    const property = properties[featureId] || null;
    resultProperties.push(property);
  }
  return resultProperties;
}
export function checkPropertiesLength(featureIds, propertyTable) {
  let needFlatten = false;
  for (const attribute of Object.values(propertyTable)) {
    if (featureIds.length !== attribute.length) {
      needFlatten = true;
    }
  }
  return needFlatten;
}
const STRING_TYPE = 'string';
const SHORT_INT_TYPE = 'Int32';
const DOUBLE_TYPE = 'double';
const OBJECT_ID_TYPE = 'OBJECTID';
export function getAttributeType(key, attribute) {
  if (key === OBJECT_ID_TYPE) {
    return OBJECT_ID_TYPE;
  }
  if (typeof attribute === STRING_TYPE) {
    return STRING_TYPE;
  } else if (typeof attribute === 'number') {
    return Number.isInteger(attribute) ? SHORT_INT_TYPE : DOUBLE_TYPE;
  }
  return STRING_TYPE;
}
export function createdStorageAttribute(attributeIndex, key, attributeType) {
  const storageAttribute = {
    key: "f_".concat(attributeIndex),
    name: key,
    ordering: ['attributeValues'],
    header: [{
      property: 'count',
      valueType: 'UInt32'
    }],
    attributeValues: {
      valueType: 'Int32',
      valuesPerElement: 1
    }
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
export function getFieldAttributeType(attributeType) {
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
export function createFieldAttribute(key, fieldAttributeType) {
  return {
    name: key,
    type: fieldAttributeType,
    alias: key
  };
}
export function createPopupInfo(propertyTable) {
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
function setupStringAttribute(storageAttribute) {
  storageAttribute.ordering.unshift('attributeByteCounts');
  storageAttribute.header.push({
    property: 'attributeValuesByteCount',
    valueType: 'UInt32'
  });
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
function setupIdAttribute(storageAttribute) {
  storageAttribute.attributeValues = {
    valueType: 'Oid32',
    valuesPerElement: 1
  };
}
function setupDoubleAttribute(storageAttribute) {
  storageAttribute.attributeValues = {
    valueType: 'Float64',
    valuesPerElement: 1
  };
}
//# sourceMappingURL=feature-attributes.js.map