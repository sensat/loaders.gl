import type { GeoPackageLoaderOptions } from '../geopackage-loader';
import { Tables, ObjectRowTable, Feature } from '@loaders.gl/schema';
export declare const DEFAULT_SQLJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/";
export default function parseGeoPackage(arrayBuffer: ArrayBuffer, options?: GeoPackageLoaderOptions): Promise<Tables<ObjectRowTable> | Record<string, Feature[]>>;
//# sourceMappingURL=parse-geopackage.d.ts.map