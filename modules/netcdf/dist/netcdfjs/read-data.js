"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRecord = exports.readNonRecord = void 0;
const read_type_1 = require("./read-type");
// const STREAMING = 4294967295;
/**
 * Read data for the given non-record variable
 * @param buffer - Buffer for the file data
 * @param variable - Variable metadata
 * @return Data of the element
 */
function readNonRecord(buffer, variable) {
    // variable type
    const type = (0, read_type_1.str2num)(variable.type);
    // size of the data
    const size = variable.size / (0, read_type_1.num2bytes)(type);
    // iterates over the data
    const data = new Array(size);
    for (let i = 0; i < size; i++) {
        data[i] = (0, read_type_1.readType)(buffer, type, 1);
    }
    return data;
}
exports.readNonRecord = readNonRecord;
/**
 * Read data for the given record variable
 * @param buffer - Buffer for the file data
 * @param variable - Variable metadata
 * @param recordDimension - Record dimension metadata
 * @return - Data of the element
 */
function readRecord(buffer, variable, recordDimension) {
    // variable type
    const type = (0, read_type_1.str2num)(variable.type);
    const width = variable.size ? variable.size / (0, read_type_1.num2bytes)(type) : 1;
    // size of the data
    // TODO streaming data
    const size = recordDimension.length;
    // iterates over the data
    const data = new Array(size);
    const step = recordDimension.recordStep;
    for (let i = 0; i < size; i++) {
        const currentOffset = buffer.offset;
        data[i] = (0, read_type_1.readType)(buffer, type, width);
        buffer.seek(currentOffset + step);
    }
    return data;
}
exports.readRecord = readRecord;
