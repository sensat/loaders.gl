"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readNonRecord = readNonRecord;
exports.readRecord = readRecord;
var _readType = require("./read-type");
function readNonRecord(buffer, variable) {
  var type = (0, _readType.str2num)(variable.type);
  var size = variable.size / (0, _readType.num2bytes)(type);
  var data = new Array(size);
  for (var i = 0; i < size; i++) {
    data[i] = (0, _readType.readType)(buffer, type, 1);
  }
  return data;
}
function readRecord(buffer, variable, recordDimension) {
  var type = (0, _readType.str2num)(variable.type);
  var width = variable.size ? variable.size / (0, _readType.num2bytes)(type) : 1;
  var size = recordDimension.length;
  var data = new Array(size);
  var step = recordDimension.recordStep;
  for (var i = 0; i < size; i++) {
    var currentOffset = buffer.offset;
    data[i] = (0, _readType.readType)(buffer, type, width);
    buffer.seek(currentOffset + step);
  }
  return data;
}
//# sourceMappingURL=read-data.js.map