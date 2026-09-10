/* eslint-disable @typescript-eslint/no-var-requires */

import {path} from '@sensat/loaders-gl-loader-utils';
const {resolve} = path;

// NOTE - Replace with a transform of ocular-dev-tools aliases?
function makeAliases() {
  return {
    test: resolve('./test'),
    '@sensat/loaders-gl-3d-tiles/test': resolve('./modules/3d-tiles/test'),
    '@sensat/loaders-gl-arrow/test': resolve('./modules/arrow/test'),
    '@sensat/loaders-gl-bson/test': resolve('./modules/bson/test'),
    '@sensat/loaders-gl-compression/test': resolve('./modules/compression/test'),
    '@sensat/loaders-gl-crypto/test': resolve('./modules/crypto/test'),
    '@sensat/loaders-gl-core/test': resolve('./modules/core/test'),
    '@sensat/loaders-gl-csv/test': resolve('./modules/csv/test'),
    '@sensat/loaders-gl-draco/test': resolve('./modules/draco/test'),
    '@sensat/loaders-gl-excel/test': resolve('./modules/excel/test'),
    '@sensat/loaders-gl-flatgeobuf/test': resolve('./modules/flatgeobuf/test'),
    '@sensat/loaders-gl-geopackage/test': resolve('./modules/geopackage/test'),
    '@sensat/loaders-gl-geotiff/test': resolve('./modules/geotiff/test'),
    '@sensat/loaders-gl-gis/test': resolve('./modules/gis/test'),
    '@sensat/loaders-gl-gltf/test': resolve('./modules/gltf/test'),
    '@sensat/loaders-gl-i3s/test': resolve('./modules/i3s/test'),
    '@sensat/loaders-gl-images/test': resolve('./modules/images/test'),
    '@sensat/loaders-gl-json/test': resolve('./modules/json/test'),
    '@sensat/loaders-gl-kml/test': resolve('./modules/kml/test'),
    '@sensat/loaders-gl-las/test': resolve('./modules/las/test'),
    '@sensat/loaders-gl-lerc/test': resolve('./modules/lerc/test'),
    '@sensat/loaders-gl-mlt/test': resolve('./modules/mlt/test'),
    '@sensat/loaders-gl-mvt/test': resolve('./modules/mvt/test'),
    '@sensat/loaders-gl-netcdf/test': resolve('./modules/netcdf/test'),
    '@sensat/loaders-gl-obj/test': resolve('./modules/obj/test'),
    '@sensat/loaders-gl-parquet/test': resolve('./modules/parquet/test'),
    '@sensat/loaders-gl-pcd/test': resolve('./modules/pcd/test'),
    '@sensat/loaders-gl-ply/test': resolve('./modules/ply/test'),
    '@sensat/loaders-gl-pmtiles/test': resolve('./modules/pmtiles/test'),
    '@sensat/loaders-gl-polyfills/test': resolve('./modules/polyfills/test'),
    '@sensat/loaders-gl-potree/test': resolve('./modules/potree/test'),
    '@sensat/loaders-gl-shapefile/test': resolve('./modules/shapefile/test'),
    '@sensat/loaders-gl-schema/test': resolve('./modules/schema/test'),
    '@sensat/loaders-gl-terrain/test': resolve('./modules/terrain/test'),
    '@sensat/loaders-gl-textures/test': resolve('./modules/textures/test'),
    '@sensat/loaders-gl-tile-converter/test': resolve('./apps/tile-converter/test'),
    '@sensat/loaders-gl-tiles/test': resolve('./modules/tiles/test'),
    '@sensat/loaders-gl-video/test': resolve('./modules/video/test'),
    '@sensat/loaders-gl-wkt/test': resolve('./modules/wkt/test'),
    '@sensat/loaders-gl-wms/test': resolve('./modules/wms/test'),
    '@sensat/loaders-gl-worker-utils/test': resolve('./modules/worker-utils/test'),
    '@sensat/loaders-gl-xml/test': resolve('./modules/xml/test'),
    '@loaders.gl/zarr/test': resolve('./modules/zarr/test'),
    '@sensat/loaders-gl-zip/test': resolve('./modules/zip/test'),
    // eslint-disable-next-line camelcase
    node_modules: resolve('./node_modules')
  };
}

export default makeAliases();
