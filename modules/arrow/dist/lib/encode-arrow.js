"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeArrowSync = void 0;
const apache_arrow_1 = require("apache-arrow");
const types_1 = require("../types");
/**
 * Encodes set of arrays into the Apache Arrow columnar format
 * https://arrow.apache.org/docs/format/Columnar.html#ipc-file-format
 * @param data - columns data
 * @param options - the writer options
 * @returns - encoded ArrayBuffer
 */
function encodeArrowSync(data) {
    const vectors = {};
    for (const arrayData of data) {
        const arrayVector = createVector(arrayData.array, arrayData.type);
        vectors[arrayData.name] = arrayVector;
    }
    const table = new apache_arrow_1.Table(vectors);
    const arrowBuffer = (0, apache_arrow_1.tableToIPC)(table);
    return arrowBuffer;
}
exports.encodeArrowSync = encodeArrowSync;
/**
 * Create Arrow Vector from given data and vector type
 * @param array {import('../types').AnyArrayType} - columns data
 * @param type {number} - the writer options
 * @return a vector of one of vector's types defined in the Apache Arrow library
 */
function createVector(array, type) {
    switch (type) {
        case types_1.VECTOR_TYPES.DATE:
            return (0, apache_arrow_1.vectorFromArray)(array);
        case types_1.VECTOR_TYPES.FLOAT:
        default:
            return (0, apache_arrow_1.vectorFromArray)(array);
    }
}
