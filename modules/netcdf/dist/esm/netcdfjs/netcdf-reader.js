import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { IOBuffer } from '../iobuffer/iobuffer';
import { readNetCDFHeader } from './read-header';
import { readRecord, readNonRecord } from './read-data';
export class NetCDFReader {
  constructor(data) {
    _defineProperty(this, "header", void 0);
    _defineProperty(this, "buffer", void 0);
    const buffer = new IOBuffer(data);
    buffer.setBigEndian();
    const magic = buffer.readChars(3);
    if (magic !== 'CDF') {
      throw new Error("NetCDF: file should start with 'CDF', found ".concat(magic));
    }
    const version = buffer.readByte();
    if (version > 2) {
      throw new Error("NetCDF: unsupported version ".concat(version));
    }
    this.header = readNetCDFHeader(buffer, version);
    this.buffer = buffer;
  }
  get version() {
    if (this.header.version === 1) {
      return 'classic format';
    }
    return '64-bit offset format';
  }
  get recordDimension() {
    return this.header.recordDimension;
  }
  get dimensions() {
    return this.header.dimensions;
  }
  get attributes() {
    return this.header.attributes;
  }
  get variables() {
    return this.header.variables;
  }
  attributeExists(attributeName) {
    const attribute = this.attributes.find(val => val.name === attributeName);
    return attribute !== undefined;
  }
  getAttribute(attributeName) {
    const attribute = this.attributes.find(val => val.name === attributeName);
    if (attribute) return attribute.value;
    return null;
  }
  dataVariableExists(variableName) {
    const variable = this.header.variables.find(function (val) {
      return val.name === variableName;
    });
    return variable !== undefined;
  }
  getDataVariableAsString(variableName) {
    const variable = this.getDataVariable(variableName);
    if (variable) return variable.join('');
    return null;
  }
  getDataVariable(variableName) {
    let variable;
    if (typeof variableName === 'string') {
      variable = this.header.variables.find(function (val) {
        return val.name === variableName;
      });
    } else {
      variable = variableName;
    }
    if (variable === undefined) {
      throw new Error("NetCDF: variable not found: ".concat(variableName));
    }
    this.buffer.seek(variable.offset);
    if (variable.record) {
      return readRecord(this.buffer, variable, this.header.recordDimension);
    }
    return readNonRecord(this.buffer, variable);
  }
  toString() {
    const result = [];
    result.push('DIMENSIONS');
    for (const dimension of this.dimensions) {
      result.push("  ".concat(dimension.name.padEnd(30), " = size: ").concat(dimension.size));
    }
    result.push('');
    result.push('GLOBAL ATTRIBUTES');
    for (const attribute of this.attributes) {
      result.push("  ".concat(attribute.name.padEnd(30), " = ").concat(attribute.value));
    }
    const variables = JSON.parse(JSON.stringify(this.variables));
    result.push('');
    result.push('VARIABLES:');
    for (const variable of variables) {
      variable.value = this.getDataVariable(variable);
      let stringify = JSON.stringify(variable.value);
      if (stringify.length > 50) stringify = stringify.substring(0, 50);
      if (!isNaN(variable.value.length)) {
        stringify += " (length: ".concat(variable.value.length, ")");
      }
      result.push("  ".concat(variable.name.padEnd(30), " = ").concat(stringify));
    }
    return result.join('\n');
  }
}
//# sourceMappingURL=netcdf-reader.js.map