import type { IOBuffer } from '../iobuffer/iobuffer';
import type { NetCDFRecordDimension, NetCDFVariable } from './netcdf-types';
/**
 * Read data for the given non-record variable
 * @param buffer - Buffer for the file data
 * @param variable - Variable metadata
 * @return Data of the element
 */
export declare function readNonRecord(buffer: IOBuffer, variable: NetCDFVariable): (string | number | number[] | Uint8Array)[];
/**
 * Read data for the given record variable
 * @param buffer - Buffer for the file data
 * @param variable - Variable metadata
 * @param recordDimension - Record dimension metadata
 * @return - Data of the element
 */
export declare function readRecord(buffer: IOBuffer, variable: NetCDFVariable, recordDimension: NetCDFRecordDimension): (string | number | number[] | Uint8Array)[];
//# sourceMappingURL=read-data.d.ts.map