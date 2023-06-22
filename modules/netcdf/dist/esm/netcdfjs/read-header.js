import { readType, num2str } from './read-type';
const ZERO = 0;
const NC_DIMENSION = 10;
const NC_VARIABLE = 11;
const NC_ATTRIBUTE = 12;
const NC_UNLIMITED = 0;
export function readNetCDFHeader(buffer, version) {
  const recordDimensionLength = buffer.readUint32();
  const dimList = readDimensionsList(buffer);
  const attributes = readAttributesList(buffer);
  const variableList = readVariablesList(buffer, dimList.recordId, version);
  const header = {
    version,
    recordDimension: {
      length: recordDimensionLength,
      id: dimList.recordId,
      name: dimList.recordName,
      recordStep: variableList.recordStep
    },
    dimensions: dimList.dimensions,
    variables: variableList.variables,
    attributes
  };
  return header;
}
function readDimensionsList(buffer) {
  const dimList = buffer.readUint32();
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
  const dimensionSize = buffer.readUint32();
  const dimensions = new Array(dimensionSize);
  let recordId;
  let recordName;
  for (let dim = 0; dim < dimensionSize; dim++) {
    const name = readName(buffer);
    const size = buffer.readUint32();
    if (size === NC_UNLIMITED) {
      recordId = dim;
      recordName = name;
    }
    dimensions[dim] = {
      name,
      size
    };
  }
  return {
    dimensions,
    recordId,
    recordName
  };
}
function readAttributesList(buffer) {
  const gAttList = buffer.readUint32();
  if (gAttList === ZERO) {
    if (buffer.readUint32() !== ZERO) {
      throw new Error('NetCDF: wrong empty tag for list of attributes');
    }
    return [];
  }
  if (gAttList !== NC_ATTRIBUTE) {
    throw new Error('NetCDF: wrong tag for list of attributes');
  }
  const attributeSize = buffer.readUint32();
  const attributes = new Array(attributeSize);
  for (let gAtt = 0; gAtt < attributeSize; gAtt++) {
    const name = readName(buffer);
    const type = buffer.readUint32();
    if (type < 1 || type > 6) {
      throw new Error("NetCDF: non valid type ".concat(type));
    }
    const size = buffer.readUint32();
    const value = readType(buffer, type, size);
    padding(buffer);
    attributes[gAtt] = {
      name,
      type: num2str(type),
      value
    };
  }
  return attributes;
}
function readVariablesList(buffer, recordId, version) {
  const varList = buffer.readUint32();
  let recordStep = 0;
  if (varList === ZERO) {
    if (buffer.readUint32() !== ZERO) {
      throw new Error('NetCDF: wrong empty tag for list of variables');
    }
    return {
      recordStep,
      variables: []
    };
  }
  if (varList !== NC_VARIABLE) {
    throw new Error('NetCDF: wrong tag for list of variables');
  }
  const variableSize = buffer.readUint32();
  const variables = new Array(variableSize);
  for (let v = 0; v < variableSize; v++) {
    const name = readName(buffer);
    const dimensionality = buffer.readUint32();
    const dimensionsIds = new Array(dimensionality);
    for (let dim = 0; dim < dimensionality; dim++) {
      dimensionsIds[dim] = buffer.readUint32();
    }
    const attributes = readAttributesList(buffer);
    const type = buffer.readUint32();
    if (type < 1 && type > 6) {
      throw new Error("NetCDF: non valid type ".concat(type));
    }
    const varSize = buffer.readUint32();
    let offset = buffer.readUint32();
    if (version === 2) {
      if (offset > 0) {
        throw new Error('NetCDF: offsets larger than 4GB not supported');
      }
      offset = buffer.readUint32();
    }
    let record = false;
    if (typeof recordId !== 'undefined' && dimensionsIds[0] === recordId) {
      recordStep += varSize;
      record = true;
    }
    variables[v] = {
      name,
      dimensions: dimensionsIds,
      attributes,
      type: num2str(type),
      size: varSize,
      offset,
      record
    };
  }
  return {
    variables,
    recordStep
  };
}
export function readName(buffer) {
  const nameLength = buffer.readUint32();
  const name = buffer.readChars(nameLength);
  padding(buffer);
  return name;
}
function padding(buffer) {
  if (buffer.offset % 4 !== 0) {
    buffer.skip(4 - buffer.offset % 4);
  }
}
//# sourceMappingURL=read-header.js.map