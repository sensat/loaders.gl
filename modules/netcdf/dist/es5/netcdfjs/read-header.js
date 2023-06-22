"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readName = readName;
exports.readNetCDFHeader = readNetCDFHeader;
var _readType = require("./read-type");
var ZERO = 0;
var NC_DIMENSION = 10;
var NC_VARIABLE = 11;
var NC_ATTRIBUTE = 12;
var NC_UNLIMITED = 0;
function readNetCDFHeader(buffer, version) {
  var recordDimensionLength = buffer.readUint32();
  var dimList = readDimensionsList(buffer);
  var attributes = readAttributesList(buffer);
  var variableList = readVariablesList(buffer, dimList.recordId, version);
  var header = {
    version: version,
    recordDimension: {
      length: recordDimensionLength,
      id: dimList.recordId,
      name: dimList.recordName,
      recordStep: variableList.recordStep
    },
    dimensions: dimList.dimensions,
    variables: variableList.variables,
    attributes: attributes
  };
  return header;
}
function readDimensionsList(buffer) {
  var dimList = buffer.readUint32();
  if (dimList === ZERO) {
    if (buffer.readUint32() !== ZERO) {
      throw new Error('NetCDF: wrong empty tag for list of dimensions');
    }
    return {
      recordId: 0,
      recordName: '',
      dimensions: []
    };
  }
  if (dimList !== NC_DIMENSION) {
    throw new Error('NetCDF: wrong tag for list of dimensions');
  }
  var dimensionSize = buffer.readUint32();
  var dimensions = new Array(dimensionSize);
  var recordId;
  var recordName;
  for (var dim = 0; dim < dimensionSize; dim++) {
    var name = readName(buffer);
    var size = buffer.readUint32();
    if (size === NC_UNLIMITED) {
      recordId = dim;
      recordName = name;
    }
    dimensions[dim] = {
      name: name,
      size: size
    };
  }
  return {
    dimensions: dimensions,
    recordId: recordId,
    recordName: recordName
  };
}
function readAttributesList(buffer) {
  var gAttList = buffer.readUint32();
  if (gAttList === ZERO) {
    if (buffer.readUint32() !== ZERO) {
      throw new Error('NetCDF: wrong empty tag for list of attributes');
    }
    return [];
  }
  if (gAttList !== NC_ATTRIBUTE) {
    throw new Error('NetCDF: wrong tag for list of attributes');
  }
  var attributeSize = buffer.readUint32();
  var attributes = new Array(attributeSize);
  for (var gAtt = 0; gAtt < attributeSize; gAtt++) {
    var name = readName(buffer);
    var type = buffer.readUint32();
    if (type < 1 || type > 6) {
      throw new Error("NetCDF: non valid type ".concat(type));
    }
    var size = buffer.readUint32();
    var value = (0, _readType.readType)(buffer, type, size);
    padding(buffer);
    attributes[gAtt] = {
      name: name,
      type: (0, _readType.num2str)(type),
      value: value
    };
  }
  return attributes;
}
function readVariablesList(buffer, recordId, version) {
  var varList = buffer.readUint32();
  var recordStep = 0;
  if (varList === ZERO) {
    if (buffer.readUint32() !== ZERO) {
      throw new Error('NetCDF: wrong empty tag for list of variables');
    }
    return {
      recordStep: recordStep,
      variables: []
    };
  }
  if (varList !== NC_VARIABLE) {
    throw new Error('NetCDF: wrong tag for list of variables');
  }
  var variableSize = buffer.readUint32();
  var variables = new Array(variableSize);
  for (var v = 0; v < variableSize; v++) {
    var name = readName(buffer);
    var dimensionality = buffer.readUint32();
    var dimensionsIds = new Array(dimensionality);
    for (var dim = 0; dim < dimensionality; dim++) {
      dimensionsIds[dim] = buffer.readUint32();
    }
    var attributes = readAttributesList(buffer);
    var type = buffer.readUint32();
    if (type < 1 && type > 6) {
      throw new Error("NetCDF: non valid type ".concat(type));
    }
    var varSize = buffer.readUint32();
    var offset = buffer.readUint32();
    if (version === 2) {
      if (offset > 0) {
        throw new Error('NetCDF: offsets larger than 4GB not supported');
      }
      offset = buffer.readUint32();
    }
    var record = false;
    if (typeof recordId !== 'undefined' && dimensionsIds[0] === recordId) {
      recordStep += varSize;
      record = true;
    }
    variables[v] = {
      name: name,
      dimensions: dimensionsIds,
      attributes: attributes,
      type: (0, _readType.num2str)(type),
      size: varSize,
      offset: offset,
      record: record
    };
  }
  return {
    variables: variables,
    recordStep: recordStep
  };
}
function readName(buffer) {
  var nameLength = buffer.readUint32();
  var name = buffer.readChars(nameLength);
  padding(buffer);
  return name;
}
function padding(buffer) {
  if (buffer.offset % 4 !== 0) {
    buffer.skip(4 - buffer.offset % 4);
  }
}
//# sourceMappingURL=read-header.js.map