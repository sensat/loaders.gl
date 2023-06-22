"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COORDINATE_SYSTEM = exports.INT_16_ATTRIBUTE_TYPE = exports.FLOAT_64_TYPE = exports.OBJECT_ID_ATTRIBUTE_TYPE = exports.STRING_ATTRIBUTE_TYPE = exports.sizeOf = exports.GL_TYPE_MAP = exports.getConstructorForDataFormat = void 0;
const constants_1 = __importDefault(require("@luma.gl/constants"));
const types_1 = require("../../types");
function getConstructorForDataFormat(dataType) {
    switch (dataType) {
        case types_1.DATA_TYPE.UInt8:
            return Uint8Array;
        case types_1.DATA_TYPE.UInt16:
            return Uint16Array;
        case types_1.DATA_TYPE.UInt32:
            return Uint32Array;
        case types_1.DATA_TYPE.Float32:
            return Float32Array;
        case types_1.DATA_TYPE.UInt64:
            return Float64Array;
        default:
            throw new Error(`parse i3s tile content: unknown type of data: ${dataType}`);
    }
}
exports.getConstructorForDataFormat = getConstructorForDataFormat;
exports.GL_TYPE_MAP = {
    UInt8: constants_1.default.UNSIGNED_BYTE,
    UInt16: constants_1.default.UNSIGNED_SHORT,
    Float32: constants_1.default.FLOAT,
    UInt32: constants_1.default.UNSIGNED_INT,
    UInt64: constants_1.default.DOUBLE
};
/**
 * Returns how many bytes a type occupies
 * @param dataType
 * @returns
 */
function sizeOf(dataType) {
    switch (dataType) {
        case types_1.DATA_TYPE.UInt8:
            return 1;
        case types_1.DATA_TYPE.UInt16:
        case types_1.DATA_TYPE.Int16:
            return 2;
        case types_1.DATA_TYPE.UInt32:
        case types_1.DATA_TYPE.Int32:
        case types_1.DATA_TYPE.Float32:
            return 4;
        case types_1.DATA_TYPE.UInt64:
        case types_1.DATA_TYPE.Int64:
        case types_1.DATA_TYPE.Float64:
            return 8;
        default:
            throw new Error(`parse i3s tile content: unknown size of data: ${dataType}`);
    }
}
exports.sizeOf = sizeOf;
exports.STRING_ATTRIBUTE_TYPE = 'String';
exports.OBJECT_ID_ATTRIBUTE_TYPE = 'Oid32';
exports.FLOAT_64_TYPE = 'Float64';
exports.INT_16_ATTRIBUTE_TYPE = 'Int16';
// https://github.com/visgl/deck.gl/blob/9548f43cba2234a1f4877b6b17f6c88eb35b2e08/modules/core/src/lib/constants.js#L27
// Describes the format of positions
var COORDINATE_SYSTEM;
(function (COORDINATE_SYSTEM) {
    /**
     * `LNGLAT` if rendering into a geospatial viewport, `CARTESIAN` otherwise
     */
    COORDINATE_SYSTEM[COORDINATE_SYSTEM["DEFAULT"] = -1] = "DEFAULT";
    /**
     * Positions are interpreted as [lng, lat, elevation]
     * lng lat are degrees, elevation is meters. distances as meters.
     */
    COORDINATE_SYSTEM[COORDINATE_SYSTEM["LNGLAT"] = 1] = "LNGLAT";
    /**
     * Positions are interpreted as meter offsets, distances as meters
     */
    COORDINATE_SYSTEM[COORDINATE_SYSTEM["METER_OFFSETS"] = 2] = "METER_OFFSETS";
    /**
     * Positions are interpreted as lng lat offsets: [deltaLng, deltaLat, elevation]
     * deltaLng, deltaLat are delta degrees, elevation is meters.
     * distances as meters.
     */
    COORDINATE_SYSTEM[COORDINATE_SYSTEM["LNGLAT_OFFSETS"] = 3] = "LNGLAT_OFFSETS";
    /**
     * Non-geospatial
     */
    COORDINATE_SYSTEM[COORDINATE_SYSTEM["CARTESIAN"] = 0] = "CARTESIAN";
})(COORDINATE_SYSTEM = exports.COORDINATE_SYSTEM || (exports.COORDINATE_SYSTEM = {}));
