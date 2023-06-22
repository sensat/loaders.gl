import { STRING_ATTRIBUTE_TYPE, OBJECT_ID_ATTRIBUTE_TYPE, FLOAT_64_TYPE, INT_16_ATTRIBUTE_TYPE } from './constants';
export function parseI3STileAttribute(arrayBuffer, options) {
  const {
    attributeName,
    attributeType
  } = options;
  if (!attributeName) {
    return {};
  }
  return {
    [attributeName]: attributeType ? parseAttribute(attributeType, arrayBuffer) : null
  };
}
function parseAttribute(attributeType, arrayBuffer) {
  switch (attributeType) {
    case STRING_ATTRIBUTE_TYPE:
      return parseStringsAttribute(arrayBuffer);
    case OBJECT_ID_ATTRIBUTE_TYPE:
      return parseShortNumberAttribute(arrayBuffer);
    case FLOAT_64_TYPE:
      return parseFloatAttribute(arrayBuffer);
    case INT_16_ATTRIBUTE_TYPE:
      return parseInt16ShortNumberAttribute(arrayBuffer);
    default:
      return parseShortNumberAttribute(arrayBuffer);
  }
}
function parseShortNumberAttribute(arrayBuffer) {
  const countOffset = 4;
  return new Uint32Array(arrayBuffer, countOffset);
}
function parseInt16ShortNumberAttribute(arrayBuffer) {
  const countOffset = 4;
  return new Int16Array(arrayBuffer, countOffset);
}
function parseFloatAttribute(arrayBuffer) {
  const countOffset = 8;
  return new Float64Array(arrayBuffer, countOffset);
}
function parseStringsAttribute(arrayBuffer) {
  const stringsCountOffset = 0;
  const dataOffset = 8;
  const bytesPerStringSize = 4;
  const stringsArray = [];
  try {
    const stringsCount = new DataView(arrayBuffer, stringsCountOffset, bytesPerStringSize).getUint32(stringsCountOffset, true);
    const stringSizes = new Uint32Array(arrayBuffer, dataOffset, stringsCount);
    let stringOffset = dataOffset + stringsCount * bytesPerStringSize;
    for (const stringByteSize of stringSizes) {
      const textDecoder = new TextDecoder('utf-8');
      const stringAttribute = new Uint8Array(arrayBuffer, stringOffset, stringByteSize);
      stringsArray.push(textDecoder.decode(stringAttribute));
      stringOffset += stringByteSize;
    }
  } catch (error) {
    console.error('Parse string attribute error: ', error.message);
  }
  return stringsArray;
}
//# sourceMappingURL=parse-i3s-attribute.js.map