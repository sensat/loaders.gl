"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypeInfo = getTypeInfo;
var _arrowLikeType = require("./arrow-like-type");
function getTypeInfo(arrowTypeLike) {
  return {
    typeId: arrowTypeLike.typeId,
    ArrayType: arrowTypeLike.ArrayType,
    typeName: arrowTypeLike.toString(),
    typeEnumName: getTypeKey(arrowTypeLike.typeId),
    precision: arrowTypeLike.precision
  };
}
var ReverseType = null;
function getTypeKey(typeKey) {
  if (!ReverseType) {
    ReverseType = {};
    for (var _key in _arrowLikeType.Type) {
      ReverseType[_arrowLikeType.Type[_key]] = _key;
    }
  }
  return ReverseType[typeKey];
}
//# sourceMappingURL=get-type-info.js.map