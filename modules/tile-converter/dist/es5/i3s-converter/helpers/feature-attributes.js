"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPropertiesLength = checkPropertiesLength;
exports.createFieldAttribute = createFieldAttribute;
exports.createPopupInfo = createPopupInfo;
exports.createdStorageAttribute = createdStorageAttribute;
exports.flattenPropertyTableByFeatureIds = flattenPropertyTableByFeatureIds;
exports.getAttributeType = getAttributeType;
exports.getFieldAttributeType = getFieldAttributeType;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function flattenPropertyTableByFeatureIds(featureIds, propertyTable) {
  var resultPropertyTable = {};
  for (var propertyName in propertyTable) {
    var properties = propertyTable[propertyName];
    resultPropertyTable[propertyName] = getPropertiesByFeatureIds(properties, featureIds);
  }
  return resultPropertyTable;
}
function getPropertiesByFeatureIds(properties, featureIds) {
  var resultProperties = [];
  var _iterator = _createForOfIteratorHelper(featureIds),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var featureId = _step.value;
      var property = properties[featureId] || null;
      resultProperties.push(property);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return resultProperties;
}
function checkPropertiesLength(featureIds, propertyTable) {
  var needFlatten = false;
  for (var _i = 0, _Object$values = Object.values(propertyTable); _i < _Object$values.length; _i++) {
    var attribute = _Object$values[_i];
    if (featureIds.length !== attribute.length) {
      needFlatten = true;
    }
  }
  return needFlatten;
}
var STRING_TYPE = 'string';
var SHORT_INT_TYPE = 'Int32';
var DOUBLE_TYPE = 'double';
var OBJECT_ID_TYPE = 'OBJECTID';
function getAttributeType(key, attribute) {
  if (key === OBJECT_ID_TYPE) {
    return OBJECT_ID_TYPE;
  }
  if ((0, _typeof2.default)(attribute) === STRING_TYPE) {
    return STRING_TYPE;
  } else if (typeof attribute === 'number') {
    return Number.isInteger(attribute) ? SHORT_INT_TYPE : DOUBLE_TYPE;
  }
  return STRING_TYPE;
}
function createdStorageAttribute(attributeIndex, key, attributeType) {
  var storageAttribute = {
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
function getFieldAttributeType(attributeType) {
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
function createFieldAttribute(key, fieldAttributeType) {
  return {
    name: key,
    type: fieldAttributeType,
    alias: key
  };
}
function createPopupInfo(propertyTable) {
  var title = '{OBJECTID}';
  var mediaInfos = [];
  var fieldInfos = [];
  var popupElements = [];
  var expressionInfos = [];
  for (var key in propertyTable) {
    fieldInfos.push({
      fieldName: key,
      visible: true,
      isEditable: false,
      label: key
    });
  }
  popupElements.push({
    fieldInfos: fieldInfos,
    type: 'fields'
  });
  return {
    title: title,
    mediaInfos: mediaInfos,
    popupElements: popupElements,
    fieldInfos: fieldInfos,
    expressionInfos: expressionInfos
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