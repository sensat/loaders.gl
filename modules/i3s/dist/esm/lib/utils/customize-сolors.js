import { load } from '@loaders.gl/core';
import { getAttributeValueType, I3SAttributeLoader } from '../../i3s-attribute-loader';
import { getUrlWithToken } from './url-utils';
export async function customizeColors(colors, featureIds, tileOptions, tilesetOptions, options) {
  var _options$i3s;
  if (!(options !== null && options !== void 0 && (_options$i3s = options.i3s) !== null && _options$i3s !== void 0 && _options$i3s.colorsByAttribute)) {
    return colors;
  }
  const colorizeAttributeField = tilesetOptions.fields.find(_ref => {
    var _options$i3s2, _options$i3s2$colorsB;
    let {
      name
    } = _ref;
    return name === (options === null || options === void 0 ? void 0 : (_options$i3s2 = options.i3s) === null || _options$i3s2 === void 0 ? void 0 : (_options$i3s2$colorsB = _options$i3s2.colorsByAttribute) === null || _options$i3s2$colorsB === void 0 ? void 0 : _options$i3s2$colorsB.attributeName);
  });
  if (!colorizeAttributeField || !['esriFieldTypeDouble', 'esriFieldTypeInteger', 'esriFieldTypeSmallInteger'].includes(colorizeAttributeField.type)) {
    return colors;
  }
  const colorizeAttributeData = await loadFeatureAttributeData(colorizeAttributeField.name, tileOptions, tilesetOptions, options);
  if (!colorizeAttributeData) {
    return colors;
  }
  const objectIdField = tilesetOptions.fields.find(_ref2 => {
    let {
      type
    } = _ref2;
    return type === 'esriFieldTypeOID';
  });
  if (!objectIdField) {
    return colors;
  }
  const objectIdAttributeData = await loadFeatureAttributeData(objectIdField.name, tileOptions, tilesetOptions, options);
  if (!objectIdAttributeData) {
    return colors;
  }
  const attributeValuesMap = {};
  for (let i = 0; i < objectIdAttributeData[objectIdField.name].length; i++) {
    attributeValuesMap[objectIdAttributeData[objectIdField.name][i]] = calculateColorForAttribute(colorizeAttributeData[colorizeAttributeField.name][i], options);
  }
  for (let i = 0; i < featureIds.value.length; i++) {
    const color = attributeValuesMap[featureIds.value[i]];
    if (!color) {
      continue;
    }
    if (options.i3s.colorsByAttribute.mode === 'multiply') {
      color.forEach((colorItem, index) => {
        colors.value[i * 4 + index] = colors.value[i * 4 + index] * colorItem / 255;
      });
    } else {
      colors.value.set(color, i * 4);
    }
  }
  return colors;
}
function calculateColorForAttribute(attributeValue, options) {
  var _options$i3s3;
  if (!(options !== null && options !== void 0 && (_options$i3s3 = options.i3s) !== null && _options$i3s3 !== void 0 && _options$i3s3.colorsByAttribute)) {
    return [255, 255, 255, 255];
  }
  const {
    minValue,
    maxValue,
    minColor,
    maxColor
  } = options.i3s.colorsByAttribute;
  const rate = (attributeValue - minValue) / (maxValue - minValue);
  const color = [255, 255, 255, 255];
  for (let i = 0; i < minColor.length; i++) {
    color[i] = Math.round((maxColor[i] - minColor[i]) * rate + minColor[i]);
  }
  return color;
}
async function loadFeatureAttributeData(attributeName, _ref3, _ref4, options) {
  var _options$i3s4;
  let {
    attributeUrls
  } = _ref3;
  let {
    attributeStorageInfo
  } = _ref4;
  const attributeIndex = attributeStorageInfo.findIndex(_ref5 => {
    let {
      name
    } = _ref5;
    return attributeName === name;
  });
  if (attributeIndex === -1) {
    return null;
  }
  const objectIdAttributeUrl = getUrlWithToken(attributeUrls[attributeIndex], options === null || options === void 0 ? void 0 : (_options$i3s4 = options.i3s) === null || _options$i3s4 === void 0 ? void 0 : _options$i3s4.token);
  const attributeType = getAttributeValueType(attributeStorageInfo[attributeIndex]);
  const objectIdAttributeData = await load(objectIdAttributeUrl, I3SAttributeLoader, {
    attributeName,
    attributeType
  });
  return objectIdAttributeData;
}
//# sourceMappingURL=customize-сolors.js.map