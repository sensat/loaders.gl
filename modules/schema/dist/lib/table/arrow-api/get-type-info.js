"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeInfo = void 0;
const arrow_like_type_1 = require("./arrow-like-type");
/**
 * Gets type information from an Arrow type object or "mock" Arrow type object
 * @param arrowTypeLike Arrow Type or type object of similar shape
 */
function getTypeInfo(arrowTypeLike) {
    return {
        typeId: arrowTypeLike.typeId,
        ArrayType: arrowTypeLike.ArrayType,
        typeName: arrowTypeLike.toString(),
        typeEnumName: getTypeKey(arrowTypeLike.typeId),
        precision: arrowTypeLike.precision
    };
}
exports.getTypeInfo = getTypeInfo;
let ReverseType = null;
function getTypeKey(typeKey) {
    if (!ReverseType) {
        ReverseType = {};
        for (const key in arrow_like_type_1.Type) {
            ReverseType[arrow_like_type_1.Type[key]] = key;
        }
    }
    return ReverseType[typeKey];
}
