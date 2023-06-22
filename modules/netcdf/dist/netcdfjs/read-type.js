"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.str2num = exports.num2bytes = exports.num2str = exports.readType = exports.TYPES = void 0;
exports.TYPES = {
    BYTE: 1,
    CHAR: 2,
    SHORT: 3,
    INT: 4,
    FLOAT: 5,
    DOUBLE: 6
};
/**
 * Given a type and a size reads the next element
 * @param buffer - Buffer for the file data
 * @param type - Type of the data to read
 * @param size - Size of the element to read
 * @return
 */
function readType(buffer, type, size) {
    switch (type) {
        case exports.TYPES.BYTE:
            return buffer.readBytes(size);
        case exports.TYPES.CHAR:
            return trimNull(buffer.readChars(size));
        case exports.TYPES.SHORT:
            return readNumber(size, buffer.readInt16.bind(buffer));
        case exports.TYPES.INT:
            return readNumber(size, buffer.readInt32.bind(buffer));
        case exports.TYPES.FLOAT:
            return readNumber(size, buffer.readFloat32.bind(buffer));
        case exports.TYPES.DOUBLE:
            return readNumber(size, buffer.readFloat64.bind(buffer));
        /* istanbul ignore next */
        default:
            throw new Error(`NetCDF: non valid type ${type}`);
    }
}
exports.readType = readType;
/**
 * Parse a number into their respective type
 * @param type - integer that represents the type
 * @return parsed value of the type
 */
function num2str(type) {
    switch (Number(type)) {
        case exports.TYPES.BYTE:
            return 'byte';
        case exports.TYPES.CHAR:
            return 'char';
        case exports.TYPES.SHORT:
            return 'short';
        case exports.TYPES.INT:
            return 'int';
        case exports.TYPES.FLOAT:
            return 'float';
        case exports.TYPES.DOUBLE:
            return 'double';
        /* istanbul ignore next */
        default:
            return 'undefined';
    }
}
exports.num2str = num2str;
/**
 * Parse a number type identifier to his size in bytes
 * @param type - integer that represents the type
 * @return size of the type
 */
function num2bytes(type) {
    switch (Number(type)) {
        case exports.TYPES.BYTE:
            return 1;
        case exports.TYPES.CHAR:
            return 1;
        case exports.TYPES.SHORT:
            return 2;
        case exports.TYPES.INT:
            return 4;
        case exports.TYPES.FLOAT:
            return 4;
        case exports.TYPES.DOUBLE:
            return 8;
        /* istanbul ignore next */
        default:
            return -1;
    }
}
exports.num2bytes = num2bytes;
/**
 * Reverse search of num2str
 * @param type string that represents the type
 * @return parsed value of the type
 */
function str2num(type) {
    switch (String(type)) {
        case 'byte':
            return exports.TYPES.BYTE;
        case 'char':
            return exports.TYPES.CHAR;
        case 'short':
            return exports.TYPES.SHORT;
        case 'int':
            return exports.TYPES.INT;
        case 'float':
            return exports.TYPES.FLOAT;
        case 'double':
            return exports.TYPES.DOUBLE;
        /* istanbul ignore next */
        default:
            return -1;
    }
}
exports.str2num = str2num;
/**
 * Auxiliary function to read numeric data
 * @param size - Size of the element to read
 * @param bufferReader - Function to read next value
 * @return
 */
function readNumber(size, bufferReader) {
    if (size !== 1) {
        const numbers = new Array(size);
        for (let i = 0; i < size; i++) {
            numbers[i] = bufferReader();
        }
        return numbers;
    }
    return bufferReader();
}
/**
 * Removes null terminate value
 * @param value - String to trim
 * @return - Trimmed string
 */
function trimNull(value) {
    if (value.charCodeAt(value.length - 1) === 0) {
        return value.substring(0, value.length - 1);
    }
    return value;
}
