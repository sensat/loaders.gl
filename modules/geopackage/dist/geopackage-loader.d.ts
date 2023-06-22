import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
export type GeoPackageLoaderOptions = LoaderOptions & {
    geopackage?: {
        sqlJsCDN: string | null;
    };
    gis?: {
        reproject?: boolean;
        _targetCrs?: string;
        format?: 'geojson' | 'tables';
    };
};
/** Geopackage loader */
export declare const GeoPackageLoader: LoaderWithParser;
//# sourceMappingURL=geopackage-loader.d.ts.map