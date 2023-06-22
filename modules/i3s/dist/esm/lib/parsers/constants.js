import GL from '@luma.gl/constants';
import { DATA_TYPE } from '../../types';
export function getConstructorForDataFormat(dataType) {
  switch (dataType) {
    case DATA_TYPE.UInt8:
      return Uint8Array;
    case DATA_TYPE.UInt16:
      return Uint16Array;
    case DATA_TYPE.UInt32:
      return Uint32Array;
    case DATA_TYPE.Float32:
      return Float32Array;
    case DATA_TYPE.UInt64:
      return Float64Array;
    default:
      throw new Error("parse i3s tile content: unknown type of data: ".concat(dataType));
  }
}
export const GL_TYPE_MAP = {
  UInt8: GL.UNSIGNED_BYTE,
  UInt16: GL.UNSIGNED_SHORT,
  Float32: GL.FLOAT,
  UInt32: GL.UNSIGNED_INT,
  UInt64: GL.DOUBLE
};
export function sizeOf(dataType) {
  switch (dataType) {
    case DATA_TYPE.UInt8:
      return 1;
    case DATA_TYPE.UInt16:
    case DATA_TYPE.Int16:
      return 2;
    case DATA_TYPE.UInt32:
    case DATA_TYPE.Int32:
    case DATA_TYPE.Float32:
      return 4;
    case DATA_TYPE.UInt64:
    case DATA_TYPE.Int64:
    case DATA_TYPE.Float64:
      return 8;
    default:
      throw new Error("parse i3s tile content: unknown size of data: ".concat(dataType));
  }
}
export const STRING_ATTRIBUTE_TYPE = 'String';
export const OBJECT_ID_ATTRIBUTE_TYPE = 'Oid32';
export const FLOAT_64_TYPE = 'Float64';
export const INT_16_ATTRIBUTE_TYPE = 'Int16';
export let COORDINATE_SYSTEM = function (COORDINATE_SYSTEM) {
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["DEFAULT"] = -1] = "DEFAULT";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["LNGLAT"] = 1] = "LNGLAT";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["METER_OFFSETS"] = 2] = "METER_OFFSETS";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["LNGLAT_OFFSETS"] = 3] = "LNGLAT_OFFSETS";
  COORDINATE_SYSTEM[COORDINATE_SYSTEM["CARTESIAN"] = 0] = "CARTESIAN";
  return COORDINATE_SYSTEM;
}({});
//# sourceMappingURL=constants.js.map