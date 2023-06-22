import { IOBuffer } from '../iobuffer/iobuffer';
import type { NetCDFHeader, NetCDFDimension, NetCDFRecordDimension, NetCDFAttribute, NetCDFVariable } from './netcdf-types';
/**
 * Reads a NetCDF v3.x file
 * https://www.unidata.ucar.edu/software/netcdf/docs/file_format_specifications.html
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @constructor
 */
export declare class NetCDFReader {
    header: NetCDFHeader;
    buffer: IOBuffer;
    constructor(data: any);
    /**
     * @return {string} - Version for the NetCDF format
     */
    get version(): "classic format" | "64-bit offset format";
    /**
     * Get metadata for the record dimension
     */
    get recordDimension(): NetCDFRecordDimension;
    /**
     * Get list of dimensions (each with `name` and `size`)
     */
    get dimensions(): NetCDFDimension[];
    /**
     * Get list of global attributes with:
     *  * `name`: String with the name of the attribute
     *  * `type`: String with the type of the attribute
     *  * `value`: A number or string with the value of the attribute
     */
    get attributes(): NetCDFAttribute[];
    /**
     * Get list of variables
     */
    get variables(): NetCDFVariable[];
    /**
     * Check if an attribute exists
     * @param attributeName - Name of the attribute to find
     * @return
     */
    attributeExists(attributeName: string): boolean;
    /**
     * Returns the value of an attribute
     * @param attributeName
     * @return Value of the attributeName or null
     */
    getAttribute(attributeName: string): string | null;
    /**
     * Check if a dataVariable exists
     * @param variableName - Name of the variable to find
     * @return
     */
    dataVariableExists(variableName: string): boolean;
    /**
     * Returns the value of a variable as a string
     * @param variableName
     * @return Value of the variable as a string or null
     */
    getDataVariableAsString(variableName: string): string | null;
    /**
     * Retrieves the data for a given variable
     * @param variableName - Name of the variable to search or variable object
     * @return List with the variable values
     */
    getDataVariable(variableName: string | object): any[];
    toString(): string;
}
//# sourceMappingURL=netcdf-reader.d.ts.map