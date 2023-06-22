import { NetCDFReader } from './netcdfjs/netcdf-reader';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const NetCDFWorkerLoader = {
  name: 'NetCDF',
  id: 'mvt',
  module: 'mvt',
  version: VERSION,
  extensions: ['cdf', 'nc'],
  mimeTypes: ['application/netcdf', 'application/x-netcdf'],
  category: 'image',
  options: {
    netcdf: {
      loadVariables: false
    }
  }
};
export const NetCDFLoader = {
  ...NetCDFWorkerLoader,
  parse: async (arrayBuffer, options) => parseNetCDF(arrayBuffer, options),
  binary: true
};
function parseNetCDF(arrayBuffer, options) {
  var _options$netcdf;
  const reader = new NetCDFReader(arrayBuffer);
  const variables = {};
  if (options !== null && options !== void 0 && (_options$netcdf = options.netcdf) !== null && _options$netcdf !== void 0 && _options$netcdf.loadData) {
    for (const variable of reader.variables) {
      variables[variable.name] = reader.getDataVariable(variable);
    }
  }
  return {
    loaderData: reader.header,
    data: variables
  };
}
export const _typecheckNetCDFWorkerLoader = NetCDFWorkerLoader;
export const _typecheckNetCDFLoader = NetCDFLoader;
//# sourceMappingURL=netcdf-loader.js.map