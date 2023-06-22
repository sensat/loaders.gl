"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetCDFReader = void 0;
const iobuffer_1 = require("../iobuffer/iobuffer");
const read_header_1 = require("./read-header");
const read_data_1 = require("./read-data");
/**
 * Reads a NetCDF v3.x file
 * https://www.unidata.ucar.edu/software/netcdf/docs/file_format_specifications.html
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @constructor
 */
class NetCDFReader {
    constructor(data) {
        const buffer = new iobuffer_1.IOBuffer(data);
        buffer.setBigEndian();
        // Validate that it's a NetCDF file
        const magic = buffer.readChars(3);
        if (magic !== 'CDF') {
            throw new Error(`NetCDF: file should start with 'CDF', found ${magic}`);
        }
        // Check the NetCDF format
        const version = buffer.readByte();
        if (version > 2) {
            throw new Error(`NetCDF: unsupported version ${version}`);
        }
        // Read the header
        this.header = (0, read_header_1.readNetCDFHeader)(buffer, version);
        this.buffer = buffer;
    }
    /**
     * @return {string} - Version for the NetCDF format
     */
    get version() {
        if (this.header.version === 1) {
            return 'classic format';
        }
        return '64-bit offset format';
    }
    /**
     * Get metadata for the record dimension
     */
    get recordDimension() {
        return this.header.recordDimension;
    }
    /**
     * Get list of dimensions (each with `name` and `size`)
     */
    get dimensions() {
        return this.header.dimensions;
    }
    /**
     * Get list of global attributes with:
     *  * `name`: String with the name of the attribute
     *  * `type`: String with the type of the attribute
     *  * `value`: A number or string with the value of the attribute
     */
    get attributes() {
        return this.header.attributes;
    }
    /**
     * Get list of variables
     */
    get variables() {
        return this.header.variables;
    }
    /**
     * Check if an attribute exists
     * @param attributeName - Name of the attribute to find
     * @return
     */
    attributeExists(attributeName) {
        const attribute = this.attributes.find((val) => val.name === attributeName);
        return attribute !== undefined;
    }
    /**
     * Returns the value of an attribute
     * @param attributeName
     * @return Value of the attributeName or null
     */
    getAttribute(attributeName) {
        const attribute = this.attributes.find((val) => val.name === attributeName);
        if (attribute)
            return attribute.value;
        return null;
    }
    /**
     * Check if a dataVariable exists
     * @param variableName - Name of the variable to find
     * @return
     */
    dataVariableExists(variableName) {
        const variable = this.header.variables.find(function (val) {
            return val.name === variableName;
        });
        return variable !== undefined;
    }
    /**
     * Returns the value of a variable as a string
     * @param variableName
     * @return Value of the variable as a string or null
     */
    getDataVariableAsString(variableName) {
        const variable = this.getDataVariable(variableName);
        if (variable)
            return variable.join('');
        return null;
    }
    /**
     * Retrieves the data for a given variable
     * @param variableName - Name of the variable to search or variable object
     * @return List with the variable values
     */
    getDataVariable(variableName) {
        let variable;
        if (typeof variableName === 'string') {
            // search the variable
            variable = this.header.variables.find(function (val) {
                return val.name === variableName;
            });
        }
        else {
            variable = variableName;
        }
        // throws if variable not found
        if (variable === undefined) {
            throw new Error(`NetCDF: variable not found: ${variableName}`);
        }
        // go to the offset position
        this.buffer.seek(variable.offset);
        if (variable.record) {
            // record variable case
            return (0, read_data_1.readRecord)(this.buffer, variable, this.header.recordDimension);
        }
        // non-record variable case
        return (0, read_data_1.readNonRecord)(this.buffer, variable);
    }
    toString() {
        const result = [];
        result.push('DIMENSIONS');
        for (const dimension of this.dimensions) {
            result.push(`  ${dimension.name.padEnd(30)} = size: ${dimension.size}`);
        }
        result.push('');
        result.push('GLOBAL ATTRIBUTES');
        for (const attribute of this.attributes) {
            result.push(`  ${attribute.name.padEnd(30)} = ${attribute.value}`);
        }
        const variables = JSON.parse(JSON.stringify(this.variables));
        result.push('');
        result.push('VARIABLES:');
        for (const variable of variables) {
            variable.value = this.getDataVariable(variable);
            let stringify = JSON.stringify(variable.value);
            if (stringify.length > 50)
                stringify = stringify.substring(0, 50);
            if (!isNaN(variable.value.length)) {
                stringify += ` (length: ${variable.value.length})`;
            }
            result.push(`  ${variable.name.padEnd(30)} = ${stringify}`);
        }
        return result.join('\n');
    }
}
exports.NetCDFReader = NetCDFReader;
