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
var _urlUtils = require("./url-utils");
function customizeColors(_x, _x2, _x3, _x4, _x5) {
  return _customizeColors.apply(this, arguments);
}
function _customizeColors() {
  _customizeColors = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(colors, featureIds, tileOptions, tilesetOptions, options) {
    var _options$i3s2;
    var colorizeAttributeField, colorizeAttributeData, objectIdField, objectIdAttributeData, attributeValuesMap, i, _loop, _i, _ret;
    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (options !== null && options !== void 0 && (_options$i3s2 = options.i3s) !== null && _options$i3s2 !== void 0 && _options$i3s2.colorsByAttribute) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return", colors);
        case 2:
          colorizeAttributeField = tilesetOptions.fields.find(function (_ref3) {
            var _options$i3s3, _options$i3s3$colorsB;
            var name = _ref3.name;
            return name === (options === null || options === void 0 ? void 0 : (_options$i3s3 = options.i3s) === null || _options$i3s3 === void 0 ? void 0 : (_options$i3s3$colorsB = _options$i3s3.colorsByAttribute) === null || _options$i3s3$colorsB === void 0 ? void 0 : _options$i3s3$colorsB.attributeName);
          });
          if (!(!colorizeAttributeField || !['esriFieldTypeDouble', 'esriFieldTypeInteger', 'esriFieldTypeSmallInteger'].includes(colorizeAttributeField.type))) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", colors);
        case 5:
          _context2.next = 7;
          return loadFeatureAttributeData(colorizeAttributeField.name, tileOptions, tilesetOptions, options);
        case 7:
          colorizeAttributeData = _context2.sent;
          if (colorizeAttributeData) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", colors);
        case 10:
          objectIdField = tilesetOptions.fields.find(function (_ref4) {
            var type = _ref4.type;
            return type === 'esriFieldTypeOID';
          });
          if (objectIdField) {
            _context2.next = 13;
            break;
          }
          return _context2.abrupt("return", colors);
        case 13:
          _context2.next = 15;
          return loadFeatureAttributeData(objectIdField.name, tileOptions, tilesetOptions, options);
        case 15:
          objectIdAttributeData = _context2.sent;
          if (objectIdAttributeData) {
            _context2.next = 18;
            break;
          }
          return _context2.abrupt("return", colors);
        case 18:
          attributeValuesMap = {};
          for (i = 0; i < objectIdAttributeData[objectIdField.name].length; i++) {
            attributeValuesMap[objectIdAttributeData[objectIdField.name][i]] = calculateColorForAttribute(colorizeAttributeData[colorizeAttributeField.name][i], options);
          }
          _loop = _regenerator.default.mark(function _loop(_i) {
            var color;
            return _regenerator.default.wrap(function _loop$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  color = attributeValuesMap[featureIds.value[_i]];
                  if (color) {
                    _context.next = 3;
                    break;
                  }
                  return _context.abrupt("return", "continue");
                case 3:
                  if (options.i3s.colorsByAttribute.mode === 'multiply') {
                    color.forEach(function (colorItem, index) {
                      colors.value[_i * 4 + index] = colors.value[_i * 4 + index] * colorItem / 255;
                    });
                  } else {
                    colors.value.set(color, _i * 4);
                  }
                case 4:
                case "end":
                  return _context.stop();
              }
            }, _loop);
          });
          _i = 0;
        case 22:
          if (!(_i < featureIds.value.length)) {
            _context2.next = 30;
            break;
          }
          return _context2.delegateYield(_loop(_i), "t0", 24);
        case 24:
          _ret = _context2.t0;
          if (!(_ret === "continue")) {
            _context2.next = 27;
            break;
          }
          return _context2.abrupt("continue", 27);
        case 27:
          _i++;
          _context2.next = 22;
          break;
        case 30:
          return _context2.abrupt("return", colors);
        case 31:
        case "end":
          return _context2.stop();
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
    return _regenerator.default.wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          attributeUrls = _ref.attributeUrls;
          attributeStorageInfo = _ref2.attributeStorageInfo;
          attributeIndex = attributeStorageInfo.findIndex(function (_ref5) {
            var name = _ref5.name;
            return attributeName === name;
          });
          if (!(attributeIndex === -1)) {
            _context3.next = 5;
            break;
          }
          return _context3.abrupt("return", null);
        case 5:
          objectIdAttributeUrl = (0, _urlUtils.getUrlWithToken)(attributeUrls[attributeIndex], options === null || options === void 0 ? void 0 : (_options$i3s4 = options.i3s) === null || _options$i3s4 === void 0 ? void 0 : _options$i3s4.token);
          attributeType = (0, _i3sAttributeLoader.getAttributeValueType)(attributeStorageInfo[attributeIndex]);
          _context3.next = 9;
          return (0, _core.load)(objectIdAttributeUrl, _i3sAttributeLoader.I3SAttributeLoader, {
            attributeName: attributeName,
            attributeType: attributeType
          });
        case 9:
          objectIdAttributeData = _context3.sent;
          return _context3.abrupt("return", objectIdAttributeData);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee2);
  }));
  return _loadFeatureAttributeData.apply(this, arguments);
}
//# sourceMappingURL=customize-сolors.js.map