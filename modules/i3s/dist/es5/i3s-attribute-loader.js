"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I3SAttributeLoader = void 0;
exports.getAttributeValueType = getAttributeValueType;
exports.loadFeatureAttributes = loadFeatureAttributes;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@loaders.gl/core");
var _parseI3sAttribute = require("./lib/parsers/parse-i3s-attribute");
var _urlUtils = require("./lib/utils/url-utils");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var EMPTY_VALUE = '';
var REJECTED_STATUS = 'rejected';
var I3SAttributeLoader = {
  name: 'I3S Attribute',
  id: 'i3s-attribute',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/binary'],
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _parseI3sAttribute.parseI3STileAttribute)(arrayBuffer, options));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function parse(_x, _x2) {
      return _parse.apply(this, arguments);
    }
    return parse;
  }(),
  extensions: ['bin'],
  options: {},
  binary: true
};
exports.I3SAttributeLoader = I3SAttributeLoader;
function loadFeatureAttributes(_x3, _x4) {
  return _loadFeatureAttributes.apply(this, arguments);
}
function _loadFeatureAttributes() {
  _loadFeatureAttributes = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(tile, featureId) {
    var options,
      _getAttributesData,
      attributeStorageInfo,
      attributeUrls,
      tilesetFields,
      attributes,
      attributeLoadPromises,
      index,
      _options$i3s,
      url,
      attributeName,
      attributeType,
      loadOptions,
      promise,
      _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
          _getAttributesData = getAttributesData(tile), attributeStorageInfo = _getAttributesData.attributeStorageInfo, attributeUrls = _getAttributesData.attributeUrls, tilesetFields = _getAttributesData.tilesetFields;
          if (!(!attributeStorageInfo || !attributeUrls || featureId < 0)) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", null);
        case 4:
          attributes = [];
          attributeLoadPromises = [];
          for (index = 0; index < attributeStorageInfo.length; index++) {
            url = (0, _urlUtils.getUrlWithToken)(attributeUrls[index], (_options$i3s = options.i3s) === null || _options$i3s === void 0 ? void 0 : _options$i3s.token);
            attributeName = attributeStorageInfo[index].name;
            attributeType = getAttributeValueType(attributeStorageInfo[index]);
            loadOptions = _objectSpread(_objectSpread({}, options), {}, {
              attributeName: attributeName,
              attributeType: attributeType
            });
            promise = (0, _core.load)(url, I3SAttributeLoader, loadOptions);
            attributeLoadPromises.push(promise);
          }
          _context2.prev = 7;
          _context2.next = 10;
          return Promise.allSettled(attributeLoadPromises);
        case 10:
          attributes = _context2.sent;
          _context2.next = 15;
          break;
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](7);
        case 15:
          if (attributes.length) {
            _context2.next = 17;
            break;
          }
          return _context2.abrupt("return", null);
        case 17:
          return _context2.abrupt("return", generateAttributesByFeatureId(attributes, attributeStorageInfo, featureId, tilesetFields));
        case 18:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[7, 13]]);
  }));
  return _loadFeatureAttributes.apply(this, arguments);
}
function getAttributesData(tile) {
  var _tile$tileset, _tile$tileset$tileset, _tile$header, _tile$tileset2, _tile$tileset2$tilese;
  var attributeStorageInfo = (_tile$tileset = tile.tileset) === null || _tile$tileset === void 0 ? void 0 : (_tile$tileset$tileset = _tile$tileset.tileset) === null || _tile$tileset$tileset === void 0 ? void 0 : _tile$tileset$tileset.attributeStorageInfo;
  var attributeUrls = (_tile$header = tile.header) === null || _tile$header === void 0 ? void 0 : _tile$header.attributeUrls;
  var tilesetFields = ((_tile$tileset2 = tile.tileset) === null || _tile$tileset2 === void 0 ? void 0 : (_tile$tileset2$tilese = _tile$tileset2.tileset) === null || _tile$tileset2$tilese === void 0 ? void 0 : _tile$tileset2$tilese.fields) || [];
  return {
    attributeStorageInfo: attributeStorageInfo,
    attributeUrls: attributeUrls,
    tilesetFields: tilesetFields
  };
}
function getAttributeValueType(attribute) {
  if (attribute.hasOwnProperty('objectIds')) {
    return 'Oid32';
  } else if (attribute.hasOwnProperty('attributeValues')) {
    return attribute.attributeValues.valueType;
  }
  return '';
}
function getFeatureIdsAttributeName(attributeStorageInfo) {
  var objectIdsAttribute = attributeStorageInfo.find(function (attribute) {
    return attribute.name.includes('OBJECTID');
  });
  return objectIdsAttribute === null || objectIdsAttribute === void 0 ? void 0 : objectIdsAttribute.name;
}
function generateAttributesByFeatureId(attributes, attributeStorageInfo, featureId, tilesetFields) {
  var objectIdsAttributeName = getFeatureIdsAttributeName(attributeStorageInfo);
  var objectIds = attributes.find(function (attribute) {
    return attribute.value[objectIdsAttributeName];
  });
  if (!objectIds) {
    return null;
  }
  var attributeIndex = objectIds.value[objectIdsAttributeName].indexOf(featureId);
  if (attributeIndex < 0) {
    return null;
  }
  return getFeatureAttributesByIndex(attributes, attributeIndex, attributeStorageInfo, tilesetFields);
}
function getFeatureAttributesByIndex(attributes, featureIdIndex, attributeStorageInfo, tilesetFields) {
  var attributesObject = {};
  for (var index = 0; index < attributeStorageInfo.length; index++) {
    var attributeName = attributeStorageInfo[index].name;
    var codedValues = getAttributeCodedValues(attributeName, tilesetFields);
    var attribute = getAttributeByIndexAndAttributeName(attributes, index, attributeName);
    attributesObject[attributeName] = formatAttributeValue(attribute, featureIdIndex, codedValues);
  }
  return attributesObject;
}
function getAttributeCodedValues(attributeName, tilesetFields) {
  var _attributeField$domai;
  var attributeField = tilesetFields.find(function (field) {
    return field.name === attributeName || field.alias === attributeName;
  });
  return (attributeField === null || attributeField === void 0 ? void 0 : (_attributeField$domai = attributeField.domain) === null || _attributeField$domai === void 0 ? void 0 : _attributeField$domai.codedValues) || [];
}
function getAttributeByIndexAndAttributeName(attributes, index, attributesName) {
  var attributeObject = attributes[index];
  if (attributeObject.status === REJECTED_STATUS) {
    return null;
  }
  return attributeObject.value[attributesName];
}
function formatAttributeValue(attribute, featureIdIndex, codedValues) {
  var value = EMPTY_VALUE;
  if (attribute && featureIdIndex in attribute) {
    value = String(attribute[featureIdIndex]).replace(/\u0000|NaN/g, '').trim();
  }
  if (codedValues.length) {
    var codeValue = codedValues.find(function (codedValue) {
      return codedValue.code === Number(value);
    });
    value = (codeValue === null || codeValue === void 0 ? void 0 : codeValue.name) || EMPTY_VALUE;
  }
  return value;
}
//# sourceMappingURL=i3s-attribute-loader.js.map