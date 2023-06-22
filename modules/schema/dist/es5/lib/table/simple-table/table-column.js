"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeColumnFromField = makeColumnFromField;
var _dataType = require("./data-type");
function makeColumnFromField(field, length) {
  var ArrayType = (0, _dataType.getArrayTypeFromDataType)(field.type, field.nullable);
  return new ArrayType(length);
}
//# sourceMappingURL=table-column.js.map