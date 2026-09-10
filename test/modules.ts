// Sets up aliases for file reader

/* eslint-disable @typescript-eslint/no-var-requires */

import './init-tests';

// Utility modules
import '@sensat/loaders-gl-polyfills/test';
import '@sensat/loaders-gl-worker-utils/test';
import '@sensat/loaders-gl-math/test';
import '@sensat/loaders-gl-geoarrow/test';

// Core
import '@sensat/loaders-gl-loader-utils/test';
import '@sensat/loaders-gl-schema/test';
import '@sensat/loaders-gl-schema-utils/test';
import '@sensat/loaders-gl-core/test';

// Image Formats
import '@sensat/loaders-gl-images/test';
import '@sensat/loaders-gl-textures/test';
import '@sensat/loaders-gl-lerc/test';
// import '@sensat/loaders-gl-video/test';
import '@sensat/loaders-gl-geotiff/test';
// import '@loaders.gl/zarr/test';
import '@sensat/loaders-gl-netcdf/test';

// Pointcloud/Mesh Formats
import '@sensat/loaders-gl-draco/test';
// import '@sensat/loaders-gl-las/test';
import '@sensat/loaders-gl-obj/test';
import '@sensat/loaders-gl-pcd/test';
import '@sensat/loaders-gl-ply/test';
import '@sensat/loaders-gl-terrain/test';

// Scenegraph Formats
import '@sensat/loaders-gl-gltf/test';

// 3D Tile Formats
import '@sensat/loaders-gl-3d-tiles/test';
import '@sensat/loaders-gl-i3s/test';
import '@sensat/loaders-gl-potree/test';
import '@sensat/loaders-gl-tiles/test';

// Geospatial Formats
// TODO restore once we have upgraded to ES modules
import '@sensat/loaders-gl-flatgeobuf/test';
import '@sensat/loaders-gl-geopackage/test';
import '@sensat/loaders-gl-gis/test';
import '@sensat/loaders-gl-kml/test';
import '@sensat/loaders-gl-shapefile/test';
import '@sensat/loaders-gl-wkt/test';
import '@sensat/loaders-gl-wms/test';

import '@sensat/loaders-gl-mlt/test';
import '@sensat/loaders-gl-mvt/test';

// Range request archive style formats
import '@sensat/loaders-gl-pmtiles/test';

// Table Formats
import '@sensat/loaders-gl-arrow/test';
import '@sensat/loaders-gl-csv/test';
import '@sensat/loaders-gl-json/test';
import '@sensat/loaders-gl-excel/test';
import '@sensat/loaders-gl-parquet/test';

// unstructured (JSON) formats
// JSON listed in tabular loaders since it optionally supports that category
import '@sensat/loaders-gl-bson/test';
import '@sensat/loaders-gl-xml/test';

// Archive Formats
import '@sensat/loaders-gl-compression/test';
import '@sensat/loaders-gl-crypto/test';
import '@sensat/loaders-gl-zip/test';
