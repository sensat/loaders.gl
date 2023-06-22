"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customizeColors = customizeColors;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@loaders.gl/core");
var _i3sAttributeLoader = require("../../i3s-attribute-loader");
var _urlUtils = require("../utils/url-utils");
function customizeColors(_x, _x2, _x3, _x4, _x5) {
  return _customizeColors.apply(this, arguments);
}
function _customizeColors() {
  _customizeColors = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(colors, featureIds, tileOptions, tilesetOptions, options) {
    var _options$i3s2;
    var colorizeAttributeField, colorizeAttributeData, objectIdField, objectIdAttributeData, attributeValuesMap, i, _i, color;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (options !== null && options !== void 0 && (_options$i3s2 = options.i3s) !== null && _options$i3s2 !== void 0 && _options$i3s2.colorsByAttribute) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", colors);
        case 2:
          colorizeAttributeField = tilesetOptions.fields.find(function (_ref3) {
            var _options$i3s3, _options$i3s3$colorsB;
            var name = _ref3.name;
            return name === (options === null || options === void 0 ? void 0 : (_options$i3s3 = options.i3s) === null || _options$i3s3 === void 0 ? void 0 : (_options$i3s3$colorsB = _options$i3s3.colorsByAttribute) === null || _options$i3s3$colorsB === void 0 ? void 0 : _options$i3s3$colorsB.attributeName);
          });
          if (!(!colorizeAttributeField || !['esriFieldTypeDouble', 'esriFieldTypeInteger', 'esriFieldTypeSmallInteger'].includes(colorizeAttributeField.type))) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", colors);
        case 5:
          _context.next = 7;
          return loadFeatureAttributeData(colorizeAttributeField.name, tileOptions, tilesetOptions, options);
        case 7:
          colorizeAttributeData = _context.sent;
          if (colorizeAttributeData) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", colors);
        case 10:
          objectIdField = tilesetOptions.fields.find(function (_ref4) {
            var type = _ref4.type;
            return type === 'esriFieldTypeOID';
          });
          if (objectIdField) {
            _context.next = 13;
            break;
          }
          return _context.abrupt("return", colors);
        case 13:
          _context.next = 15;
          return loadFeatureAttributeData(objectIdField.name, tileOptions, tilesetOptions, options);
        case 15:
          objectIdAttributeData = _context.sent;
          if (objectIdAttributeData) {
            _context.next = 18;
            break;
          }
          return _context.abrupt("return", colors);
        case 18:
          attributeValuesMap = {};
          for (i = 0; i < objectIdAttributeData[objectIdField.name].length; i++) {
            attributeValuesMap[objectIdAttributeData[objectIdField.name][i]] = calculateColorForAttribute(colorizeAttributeData[colorizeAttributeField.name][i], options);
          }
          _i = 0;
        case 21:
          if (!(_i < featureIds.value.length)) {
            _context.next = 29;
            break;
          }
          color = attributeValuesMap[featureIds.value[_i]];
          if (color) {
            _context.next = 25;
            break;
          }
          return _context.abrupt("continue", 26);
        case 25:
          colors.value.set(color, _i * 4);
        case 26:
          _i++;
          _context.next = 21;
          break;
        case 29:
          return _context.abrupt("return", colors);
        case 30:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _customizeColors.apply(this, arguments);
}
function calculateColorForAttribute(attributeValue, options) {
  var _options$i3s;
  if (!(options !== null && options !== void 0 && (_options$i3s = options.i3s) !== null && _options$i3s !== void 0 && _options$i3s.colorsByAttribute)) {
    return [255, 255, 255, 255];
  }
  var _options$i3s$colorsBy = options.i3s.colorsByAttribute,
    minValue = _options$i3s$colorsBy.minValue,
    maxValue = _options$i3s$colorsBy.maxValue,
    minColor = _options$i3s$colorsBy.minColor,
    maxColor = _options$i3s$colorsBy.maxColor;
  var rate = (attributeValue - minValue) / (maxValue - minValue);
  var color = [255, 255, 255, 255];
  for (var i = 0; i < minColor.length; i++) {
    color[i] = Math.round((maxColor[i] - minColor[i]) * rate + minColor[i]);
  }
  return color;
}
function loadFeatureAttributeData(_x6, _x7, _x8, _x9) {
  return _loadFeatureAttributeData.apply(this, arguments);
}
function _loadFeatureAttributeData() {
  _loadFeatureAttributeData = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(attributeName, _ref, _ref2, options) {
    var _options$i3s4;
    var attributeUrls, attributeStorageInfo, attributeIndex, objectIdAttributeUrl, attributeType, objectIdAttributeData;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          attributeUrls = _ref.attributeUrls;
          attributeStorageInfo = _ref2.attributeStorageInfo;
          attributeIndex = attributeStorageInfo.findIndex(function (_ref5) {
            var name = _ref5.name;
            return attributeName === name;
          });
          if (!(attributeIndex === -1)) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", null);
        case 5:
          objectIdAttributeUrl = (0, _urlUtils.getUrlWithToken)(attributeUrls[attributeIndex], options === null || options === void 0 ? void 0 : (_options$i3s4 = options.i3s) === null || _options$i3s4 === void 0 ? void 0 : _options$i3s4.token);
          attributeType = (0, _i3sAttributeLoader.getAttributeValueType)(attributeStorageInfo[attributeIndex]);
          _context2.next = 9;
          return (0, _core.load)(objectIdAttributeUrl, _i3sAttributeLoader.I3SAttributeLoader, {
            attributeName: attributeName,
            attributeType: attributeType
          });
        case 9:
          objectIdAttributeData = _context2.sent;
          return _context2.abrupt("return", objectIdAttributeData);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _loadFeatureAttributeData.apply(this, arguments);
}
//# sourceMappingURL=customizeColors.js.map