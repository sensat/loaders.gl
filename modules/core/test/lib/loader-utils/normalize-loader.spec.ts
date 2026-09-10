// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* eslint-disable max-len */
import test from 'tape-promise/tape';
import {
  isLoaderObject,
  normalizeLoader
} from '@sensat/loaders-gl-core/lib/loader-utils/normalize-loader';

import * as threeDTiles from '@sensat/loaders-gl-3d-tiles';
import * as arrow from '@sensat/loaders-gl-arrow';
import * as csv from '@sensat/loaders-gl-csv';
import * as draco from '@sensat/loaders-gl-draco';
import * as tables from '@sensat/loaders-gl-schema-utils';
import * as gltf from '@sensat/loaders-gl-gltf';
import * as images from '@sensat/loaders-gl-images';
import * as kml from '@sensat/loaders-gl-kml';
import * as las from '@sensat/loaders-gl-las';
import * as obj from '@sensat/loaders-gl-obj';
import * as pcd from '@sensat/loaders-gl-pcd';
import * as ply from '@sensat/loaders-gl-ply';
import * as zip from '@sensat/loaders-gl-zip';

const modules = [
  threeDTiles,
  arrow,
  csv,
  draco,
  tables,
  gltf,
  images,
  kml,
  las,
  obj,
  pcd,
  ply,
  zip
];

test('isLoaderObject', (t) => {
  // @ts-ignore
  t.notOk(isLoaderObject(null), 'null is not a loader');

  for (const module of modules) {
    for (const exportName in module) {
      if (exportName.endsWith('Loader')) {
        t.ok(isLoaderObject(module[exportName]), `${exportName} should be a loader`);
      }
    }
  }

  t.ok([csv.CSVLoader, {header: false}], 'loader-option array');

  t.end();
});

test('normalizeLoader', (t) => {
  const TESTS = [
    {
      title: 'loader',
      input: obj.OBJLoader
    },
    {
      title: 'loader with options',
      input: [images.ImageLoader, {image: {imageOrientation: 'flipY'}}],
      options: {image: {imageOrientation: 'flipY'}}
    }
  ];

  for (const testCase of TESTS) {
    // TODO
    // @ts-ignore
    const loader = normalizeLoader(testCase.input);
    t.ok(Array.isArray(loader.extensions), `${testCase.title}: extensions is array`);
    t.ok(loader.text || loader.binary, `${testCase.title}: text or binary flag is set`);
    if (testCase.options) {
      t.deepEqual(loader.options, testCase.options, `${testCase.title}: options populated`);
    }
  }

  t.throws(
    () =>
      normalizeLoader({
        ...images.ImageLoader,
        // @ts-ignore
        extensions: 'jpg'
      }),
    'should throw on malformed extensions field'
  );

  t.end();
});
