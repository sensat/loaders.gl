"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deduceMeshField = deduceMeshField;
exports.deduceMeshSchema = deduceMeshSchema;
exports.makeMeshAttributeMetadata = makeMeshAttributeMetadata;
var _dataType = require("../table/simple-table/data-type");
function deduceMeshSchema(attributes) {
  var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fields = deduceMeshFields(attributes);
  return {
    fields: fields,
    metadata: metadata
  };
}
function deduceMeshField(name, attribute, optionalMetadata) {
  var type = (0, _dataType.getDataTypeFromTypedArray)(attribute.value);
  var metadata = optionalMetadata ? optionalMetadata : makeMeshAttributeMetadata(attribute);
  return {
    name: name,
    type: {
      type: 'fixed-size-list',
      listSize: attribute.size,
      children: [{
        name: 'value',
        type: type
      }]
    },
    nullable: false,
    metadata: metadata
  };
}
function deduceMeshFields(attributes) {
  var fields = [];
  for (var attributeName in attributes) {
    var attribute = attributes[attributeName];
    fields.push(deduceMeshField(attributeName, attribute));
  }
  return fields;
}
function makeMeshAttributeMetadata(attribute) {
  var result = {};
  if ('byteOffset' in attribute) {
    result.byteOffset = attribute.byteOffset.toString(10);
  }
  if ('byteStride' in attribute) {
    result.byteStride = attribute.byteStride.toString(10);
  }
  if ('normalized' in attribute) {
    result.normalized = attribute.normalized.toString();
  }
  return result;
}
//# sourceMappingURL=deduce-mesh-schema.js.map