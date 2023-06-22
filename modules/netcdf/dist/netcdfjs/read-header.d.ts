import type { IOBuffer } from '../iobuffer/iobuffer';
import type { NetCDFHeader } from './netcdf-types';
/**
 * Read the header of the file
 * @param buffer - Buffer for the file data
 * @param version - Version of the file
 * @return  - Header
 */
export declare function readNetCDFHeader(buffer: IOBuffer, version: number): NetCDFHeader;
/**
 * Reads the name
 * @param buffer - Buffer for the file data
 * @return Name
 */
export declare function readName(buffer: IOBuffer): string;
//# sourceMappingURL=read-header.d.ts.map