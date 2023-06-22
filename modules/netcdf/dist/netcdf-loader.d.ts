import type { Loader, LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import type { NetCDFHeader } from './netcdfjs/netcdf-types';
export type NetCDF = {
    loaderData: NetCDFHeader;
    data: {
        [variableName: string]: any[][];
    };
};
export type NetCDFLoaderOptions = LoaderOptions & {
    netcdf?: {
        loadData?: boolean;
    };
};
/**
 * Worker loader for NETCDF
 */
export declare const NetCDFWorkerLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    extensions: string[];
    mimeTypes: string[];
    category: string;
    options: {
        netcdf: {
            loadVariables: boolean;
        };
    };
};
/**
 * Loader for the NetCDF format
 */
export declare const NetCDFLoader: {
    parse: (arrayBuffer: any, options: any) => Promise<NetCDF>;
    binary: boolean;
    name: string;
    id: string;
    module: string;
    version: any;
    extensions: string[];
    mimeTypes: string[];
    category: string;
    options: {
        netcdf: {
            loadVariables: boolean;
        };
    };
};
export declare const _typecheckNetCDFWorkerLoader: Loader;
export declare const _typecheckNetCDFLoader: LoaderWithParser;
//# sourceMappingURL=netcdf-loader.d.ts.map