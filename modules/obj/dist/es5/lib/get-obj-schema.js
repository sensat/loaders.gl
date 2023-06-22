"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOBJSchema = getOBJSchema;
var _schema = require("@loaders.gl/schema");
function getOBJSchema(attributes) {
  var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var stringMetadata = {};
  for (var key in metadata) {
    if (key !== 'value') {
      stringMetadata[key] = JSON.stringify(metadata[key]);
    }
  }
  var fields = [];
  for (var attributeName in attributes) {
    var attribute = attributes[attributeName];
    var field = getFieldFromAttribute(attributeName, attribute);
    fields.push(field);
  }
  return {
    fields: fields,
    metadata: stringMetadata
  };
}
function getFieldFromAttribute(name, attribute) {
  var metadata = {};
  for (var key in attribute) {
    if (key !== 'value') {
      metadata[key] = JSON.stringify(attribute[key]);
    }
  }
  var _getDataTypeFromArray = (0, _schema.getDataTypeFromArray)(attribute.value),
    type = _getDataTypeFromArray.type;
  var isSingleValue = attribute.size === 1 || attribute.size === undefined;
  if (!isSingleValue) {
    type = {
      type: 'fixed-size-list',
      listSize: attribute.size,
      children: [{
        name: 'values',
        type: type
      }]
    };
  }
  return {
    name: name,
    type: type,
    nullable: false,
    metadata: metadata
  };
}
//# sourceMappingURL=get-obj-schema.js.map