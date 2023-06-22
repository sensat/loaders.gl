"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STRING_ATTRIBUTE_TYPE = exports.OBJECT_ID_ATTRIBUTE_TYPE = exports.INT_16_ATTRIBUTE_TYPE = exports.GL_TYPE_MAP = exports.FLOAT_64_TYPE = exports.COORDINATE_SYSTEM = void 0;
exports.getConstructorForDataFormat = getConstructorForDataFormat;
exports.sizeOf = sizeOf;
var _constants = _interopRequireDefault(require("@luma.gl/constants"));
var _types = require("../../types");
function getConstructorForDataFormat(dataType) {
  switch (dataType) {
    case _types.DATA_TYPE.UInt8:
      return Uint8Array;
    case _types.DATA_TYPE.UInt16:
      return Uint16Array;
    case _types.DATA_TYPE.UInt32:
      return Uint32Array;
    case _types.DATA_TYPE.Float32:
      return Float32Array;
    case _types.DATA_TYPE.UInt64:
      return Float64Array;
    default:
      throw new Error("parse i3s tile content: unknown type of data: ".concat(dataType));
  }
}
var GL_TYPE_MAP = {
  UInt8: _constants.default.UNSIGNED_BYTE,
  UInt16: _constants.default.UNSIGNED_SHORT,
  Float32: _constants.default.FLOAT,
  UInt32: _constants.default.UNSIGNED_INT,
  UInt64: _constants.default.DOUBLE
};
exports.GL_TYPE_MAP = GL_TYPE_MAP;
function sizeOf(dataType) {
  switch (dataType) {
    case _types.DATA_TYPE.UInt8:
      return 1;
    case _types.DATA_TYPE.UInt16:
    case _types.DATA_TYPE.Int16:
      return 2;
    case _types.DATA_TYPE.UInt32:
    case _types.DATA_TYPE.Int32:
    case _types.DATA_TYPE.Float32:
      return 4;
    case _types.DATA_TYPE.UInt64:
    case _types.DATA_TYPE.Int64:
    case _types.DATA_TYPE.Float64:
      return 8;
    default:
      throw new Error("parse i3s tile content: unknown size of data: ".concat(dataType));
  }
}
var STRING_ATTRIBUTE_TYPE = 'String';
exports.STRING_ATTRIBUTE_TYPE = STRING_ATTRIBUTE_TYPE;
var OBJECT_ID_ATTRIBUTE_TYPE = 'Oid32';
exports.OBJECT_ID_ATTRIBUTE_TYPE = OBJECT_ID_ATTRIBUTE_TYPE;
var FLOAT_64_TYPE = 'Float64';
exports.FLOAT_64_TYPE = FLOAT_64_TYPE;
var INT_16_ATTRIBUTE_TYPE = 'Int16';
exports.INT_16_ATTRIBUTE_TYPE = INT_16_ATTRIBUTE_TYPE;
var COORDINATE_SYSTEM = function (COORDINATE_SYSTEM) {
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["DEFAULT"] = -1] = "DEFAULT";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["LNGLAT"] = 1] = "LNGLAT";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["METER_OFFSETS"] = 2] = "METER_OFFSETS";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["LNGLAT_OFFSETS"] = 3] = "LNGLAT_OFFSETS";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["CARTESIAN"] = 0] = "CARTESIAN";
  return COORDINATE_SYSTEM;
}({});
exports.COORDINATE_SYSTEM = COORDINATE_SYSTEM;
//# sourceMappingURL=constants.js.map