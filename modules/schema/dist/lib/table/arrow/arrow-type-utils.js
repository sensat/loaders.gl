"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrowType = void 0;
const apache_arrow_1 = require("apache-arrow");
// import {AbstractVector} from 'apache-arrow/vector';
function getArrowType(array) {
    switch (array.constructor) {
        case Int8Array:
            return new apache_arrow_1.Int8();
        case Uint8Array:
            return new apache_arrow_1.Uint8();
        case Int16Array:
            return new apache_arrow_1.Int16();
        case Uint16Array:
            return new apache_arrow_1.Uint16();
        case Int32Array:
            return new apache_arrow_1.Int32();
        case Uint32Array:
            return new apache_arrow_1.Uint32();
        case Float32Array:
            return new apache_arrow_1.Float32();
        case Float64Array:
            return new apache_arrow_1.Float64();
        default:
            throw new Error('array type not supported');
    }
}
exports.getArrowType = getArrowType;
/*
export function getArrowVector(array: TypedArray): AbstractVector {
  switch (array.constructor) {
    case Int8Array:
      return Int8Vector.from(array);
    case Uint8Array:
      return Uint8Vector.from(array);
    case Int16Array:
      return Int16Vector.from(array);
    case Uint16Array:
      return Uint16Vector.from(array);
    case Int32Array:
      return Int32Vector.from(array);
    case Uint32Array:
      return Uint32Vector.from(array);
    case Float32Array:
      return Float32Vector.from(array);
    case Float64Array:
      return Float64Vector.from(array);
    default:
      throw new Error('array type not supported');
  }
}
*/
