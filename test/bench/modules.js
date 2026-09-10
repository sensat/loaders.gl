// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Override aliases to point to publicly accessible github
// TODO maybe setPathPrefix is enough?
import ALIASES from '../../test/aliases';
import {_addAliases} from '@sensat/loaders-gl-loader-utils';

import loaderUtilsBench from '@sensat/loaders-gl-loader-utils/test/loader-utils.bench';
import coreBench from '@sensat/loaders-gl-core/test/core.bench';
import csvBench from '@sensat/loaders-gl-csv/test/csv.bench';
import dracoBench from '@sensat/loaders-gl-draco/test/draco.bench';
import excelBench from '@sensat/loaders-gl-excel/test/excel.bench';
import imageBench from '@sensat/loaders-gl-images/test/images.bench';
import jsonBench from '@sensat/loaders-gl-json/test/json-loader.bench';
// import mvtBench from '@sensat/loaders-gl-mvt/test/mvt-loader.bench';
import {parquetBench} from '@sensat/loaders-gl-parquet/test/parquet.bench';
// import shapefileBench from '@sensat/loaders-gl-shapefile/test/shapefile.bench';

import cryptoBench from '@sensat/loaders-gl-crypto/test/crypto.bench';
// import i3sLoaderBench from '@sensat/loaders-gl-i3s/test/i3s-loader.bench';

_addAliases(ALIASES);

// add benchmarks
export async function addModuleBenchmarksToSuite(suite) {
  await coreBench(suite);

  await parquetBench(suite);

  await jsonBench(suite);

  // await shapefileBench(suite);

  // await mvtBench(suite);
  await loaderUtilsBench(suite);

  await imageBench(suite);
  await cryptoBench(suite);

  await dracoBench(suite);
  await csvBench(suite);
  await excelBench(suite);

  // await i3sLoaderBench(suite);
}
