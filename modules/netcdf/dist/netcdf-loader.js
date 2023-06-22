"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckNetCDFLoader = exports._typecheckNetCDFWorkerLoader = exports.NetCDFLoader = exports.NetCDFWorkerLoader = void 0;
const netcdf_reader_1 = require("./netcdfjs/netcdf-reader");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Worker loader for NETCDF
 */
exports.NetCDFWorkerLoader = {
    name: 'NetCDF',
    id: 'mvt',
    module: 'mvt',
    version: VERSION,
    extensions: ['cdf', 'nc'],
    mimeTypes: [
        'application/netcdf',
        'application/x-netcdf'
        // 'application/octet-stream'
    ],
    category: 'image',
    options: {
        netcdf: {
            loadVariables: false
        }
    }
};
/**
 * Loader for the NetCDF format
 */
exports.NetCDFLoader = {
    ...exports.NetCDFWorkerLoader,
    parse: async (arrayBuffer, options) => parseNetCDF(arrayBuffer, options),
    binary: true
};
function parseNetCDF(arrayBuffer, options) {
    const reader = new netcdf_reader_1.NetCDFReader(arrayBuffer);
    const variables = {};
    if (options?.netcdf?.loadData) {
        for (const variable of reader.variables) {
            variables[variable.name] = reader.getDataVariable(variable);
        }
    }
    return {
        loaderData: reader.header,
        data: variables
    };
}
// Type tests
exports._typecheckNetCDFWorkerLoader = exports.NetCDFWorkerLoader;
exports._typecheckNetCDFLoader = exports.NetCDFLoader;
