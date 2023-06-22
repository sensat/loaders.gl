import { load } from '@loaders.gl/core';
import { parseI3STileAttribute } from './lib/parsers/parse-i3s-attribute';
import { getUrlWithToken } from './lib/utils/url-utils';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const EMPTY_VALUE = '';
const REJECTED_STATUS = 'rejected';
export const I3SAttributeLoader = {
  name: 'I3S Attribute',
  id: 'i3s-attribute',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/binary'],
  parse: async (arrayBuffer, options) => parseI3STileAttribute(arrayBuffer, options),
  extensions: ['bin'],
  options: {},
  binary: true
};
export async function loadFeatureAttributes(tile, featureId) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
    attributeStorageInfo,
    attributeUrls,
    tilesetFields
  } = getAttributesData(tile);
  if (!attributeStorageInfo || !attributeUrls || featureId < 0) {
    return null;
  }
  let attributes = [];
  const attributeLoadPromises = [];
  for (let index = 0; index < attributeStorageInfo.length; index++) {
    var _options$i3s;
    const url = getUrlWithToken(attributeUrls[index], (_options$i3s = options.i3s) === null || _options$i3s === void 0 ? void 0 : _options$i3s.token);
    const attributeName = attributeStorageInfo[index].name;
    const attributeType = getAttributeValueType(attributeStorageInfo[index]);
    const loadOptions = {
      ...options,
      attributeName,
      attributeType
    };
    const promise = load(url, I3SAttributeLoader, loadOptions);
    attributeLoadPromises.push(promise);
  }
  try {
    attributes = await Promise.allSettled(attributeLoadPromises);
  } catch (error) {}
  if (!attributes.length) {
    return null;
  }
  return generateAttributesByFeatureId(attributes, attributeStorageInfo, featureId, tilesetFields);
}
function getAttributesData(tile) {
  var _tile$tileset, _tile$tileset$tileset, _tile$header, _tile$tileset2, _tile$tileset2$tilese;
  const attributeStorageInfo = (_tile$tileset = tile.tileset) === null || _tile$tileset === void 0 ? void 0 : (_tile$tileset$tileset = _tile$tileset.tileset) === null || _tile$tileset$tileset === void 0 ? void 0 : _tile$tileset$tileset.attributeStorageInfo;
  const attributeUrls = (_tile$header = tile.header) === null || _tile$header === void 0 ? void 0 : _tile$header.attributeUrls;
  const tilesetFields = ((_tile$tileset2 = tile.tileset) === null || _tile$tileset2 === void 0 ? void 0 : (_tile$tileset2$tilese = _tile$tileset2.tileset) === null || _tile$tileset2$tilese === void 0 ? void 0 : _tile$tileset2$tilese.fields) || [];
  return {
    attributeStorageInfo,
    attributeUrls,
    tilesetFields
  };
}
export function getAttributeValueType(attribute) {
  if (attribute.hasOwnProperty('objectIds')) {
    return 'Oid32';
  } else if (attribute.hasOwnProperty('attributeValues')) {
    return attribute.attributeValues.valueType;
  }
  return '';
}
function getFeatureIdsAttributeName(attributeStorageInfo) {
  const objectIdsAttribute = attributeStorageInfo.find(attribute => attribute.name.includes('OBJECTID'));
  return objectIdsAttribute === null || objectIdsAttribute === void 0 ? void 0 : objectIdsAttribute.name;
}
function generateAttributesByFeatureId(attributes, attributeStorageInfo, featureId, tilesetFields) {
  const objectIdsAttributeName = getFeatureIdsAttributeName(attributeStorageInfo);
  const objectIds = attributes.find(attribute => attribute.value[objectIdsAttributeName]);
  if (!objectIds) {
    return null;
  }
  const attributeIndex = objectIds.value[objectIdsAttributeName].indexOf(featureId);
  if (attributeIndex < 0) {
    return null;
  }
  return getFeatureAttributesByIndex(attributes, attributeIndex, attributeStorageInfo, tilesetFields);
}
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
function getAttributeCodedValues(attributeName, tilesetFields) {
  var _attributeField$domai;
  const attributeField = tilesetFields.find(field => field.name === attributeName || field.alias === attributeName);
  return (attributeField === null || attributeField === void 0 ? void 0 : (_attributeField$domai = attributeField.domain) === null || _attributeField$domai === void 0 ? void 0 : _attributeField$domai.codedValues) || [];
}
function getAttributeByIndexAndAttributeName(attributes, index, attributesName) {
  const attributeObject = attributes[index];
  if (attributeObject.status === REJECTED_STATUS) {
    return null;
  }
  return attributeObject.value[attributesName];
}
function formatAttributeValue(attribute, featureIdIndex, codedValues) {
  let value = EMPTY_VALUE;
  if (attribute && featureIdIndex in attribute) {
    value = String(attribute[featureIdIndex]).replace(/\u0000|NaN/g, '').trim();
  }
  if (codedValues.length) {
    const codeValue = codedValues.find(codedValue => codedValue.code === Number(value));
    value = (codeValue === null || codeValue === void 0 ? void 0 : codeValue.name) || EMPTY_VALUE;
  }
  return value;
}
//# sourceMappingURL=i3s-attribute-loader.js.map