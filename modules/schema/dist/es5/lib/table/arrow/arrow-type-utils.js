"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getArrowType = getArrowType;
var _apacheArrow = require("apache-arrow");
function getArrowType(array) {
  switch (array.constructor) {
    case Int8Array:
      return new _apacheArrow.Int8();
    case Uint8Array:
      return new _apacheArrow.Uint8();
    case Int16Array:
      return new _apacheArrow.Int16();
    case Uint16Array:
      return new _apacheArrow.Uint16();
    case Int32Array:
      return new _apacheArrow.Int32();
    case Uint32Array:
      return new _apacheArrow.Uint32();
    case Float32Array:
      return new _apacheArrow.Float32();
    case Float64Array:
      return new _apacheArrow.Float64();
    default:
      throw new Error('array type not supported');
  }
}
//# sourceMappingURL=arrow-type-utils.js.map