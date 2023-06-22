import parseGeoPackage, { DEFAULT_SQLJS_CDN } from './lib/parse-geopackage';
const VERSION = 'latest';
export const GeoPackageLoader = {
  id: 'geopackage',
  name: 'GeoPackage',
  module: 'geopackage',
  version: VERSION,
  extensions: ['gpkg'],
  mimeTypes: ['application/geopackage+sqlite3'],
  category: 'geometry',
  parse: parseGeoPackage,
  options: {
    geopackage: {
      sqlJsCDN: DEFAULT_SQLJS_CDN
    },
    gis: {
      format: 'tables'
    }
  }
};
//# sourceMappingURL=geopackage-loader.js.map